using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        //we need to tell automapper, where we want to go from and to (AppUser, MemberDto)
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>()
                //what's the destination of the member you want to populate, then we specify the options (mapFrom Something)
                //The we specify the src on where we want to map from
                .ForMember(destination => destination.PhotoUrl, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(photo => photo.IsMain).Url))
                .ForMember(destination => destination.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            
            CreateMap<Photo, PhotoDtO>();
            CreateMap<MemberUpdateDto, AppUser>();
            CreateMap<RegisterDto, AppUser>();
            CreateMap<Message, MessageDto>()
                .ForMember(d => d.SenderPhotoUrl, o => o.MapFrom(s => s.Sender.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.RecipientPhotoUrl, o => o.MapFrom(s => s.Recipient.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}