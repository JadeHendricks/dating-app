using System.Collections;
using Microsoft.AspNetCore.Identity;

namespace API.Entities;
//we want the id property to be an in, so we pass into to IdentityUser
public class AppUser : IdentityUser<int> 
{
    public byte[] PasswordSalt { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public string KnownAs { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;
    public string Gender { get; set; }
    public string Introduction { get; set; }
    public string LookingFor { get; set; }
    public string Interests { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public List<Photo> Photos { get; set; } = new List<Photo>(); 
    public List<UserLike> LikedByUsers { get; set; }
    public List<UserLike> LikedUsers { get; set; }
    public List<Message> MessagesSent { get; set; }
    public List<Message> MessagesRecieved { get; set; }
    // ICollection == List for the most part
    public ICollection<AppUserRole> userRoles { get; set; }

    //we prefix it with get here so that automapper will automatically run this
    // public int GetAge()
    // {
    //     return DateOfBirth.CalculateAge();
    // }
}