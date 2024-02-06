using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class UsersController : BaseApiController
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly IPhotoService _photoService;

    public UsersController(
        IUserRepository userRepository, 
        IMapper mapper, 
        IPhotoService photoService
    )
    {
        _userRepository = userRepository;
        _mapper = mapper;
        _photoService = photoService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedList<MemberDto>>> GetUsers([FromQuery]UserParams userParams)
    {
        var currentUser = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
        userParams.CurrentUsername = currentUser.UserName;

        if (string.IsNullOrEmpty(userParams.Gender))
        {
            userParams.Gender = currentUser.Gender == "male" ? "female": "male";
        }

        //We're going to have to give our API a hint on where to find UserParams, because this is an object and a queryString is a string
        var users = await _userRepository.GetMembersAsync(userParams);

        Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages));
        return Ok(users);
    }

    [HttpGet("{username}")] // /api/users/username
    public async Task<ActionResult<MemberDto>> GetUser(string username)
    {
        return await _userRepository.GetMemberAsync(username);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
    {
        //getting our users username from the token via extension
        var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

        if (user == null) return NotFound();

        _mapper.Map(memberUpdateDto, user); //will update the user with the memberUpdateDto content
        if (await _userRepository.SaveAllAsync()) return NoContent(); //saving the changes to the db, returns 204 (everythings ok, ntohing to send back)

        return BadRequest("Failed to update user");
    }

    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDtO>> AddPhoto(IFormFile file) //file is what needs to be used in postman in te formdata section
    {
        var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

        var result = await _photoService.AddPhotoAsync(file);

        if (result.Error != null) return BadRequest(result.Error.Message);

        var photo = new Photo{
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId
        };

        if (user.Photos.Count == 0) 
        {
        photo.IsMain = true;
        }

        user.Photos.Add(photo);

        if (await _userRepository.SaveAllAsync())
        {
            //will return 201 created response with location details about where to find the newly created resource + we send the newly created resource as well
            return CreatedAtAction(nameof(GetUser), new {username = user.UserName}, _mapper.Map<PhotoDtO>(photo));
        }
        
        return BadRequest("Problem adding photo");
    }

    [HttpPut("set-main-photo/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {
        var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return NotFound();

        var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

        if (photo == null) return NotFound();
        if (photo.IsMain) return BadRequest("This is already your main photo");

        var currentMainPhoto = user.Photos.FirstOrDefault(x => x.IsMain);
        if (currentMainPhoto != null) currentMainPhoto.IsMain = false;

        photo.IsMain = true;

        if (await _userRepository.SaveAllAsync()) return NoContent();

        return BadRequest("There was a problem setting the main photo.");
    }

    [HttpDelete("delete-photo/{photoId}")]
    public async Task<ActionResult> DeletePhoto(int photoId)
    {
        var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
        var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

        if (photo == null) return NotFound();
        if (photo.IsMain) return BadRequest("You cannot delete your main photo");

        //if PublicId is null, it will be from our seeded data
        if (photo.PublicId != null)
        {
            var result = await _photoService.DeletePhotoAsync(photo.PublicId);
            if (result.Error != null) return BadRequest(result.Error.Message);
        }

        user.Photos.Remove(photo);

        if (await _userRepository.SaveAllAsync()) return Ok();
        
        return BadRequest("Problem deleting photo");
    }
}
