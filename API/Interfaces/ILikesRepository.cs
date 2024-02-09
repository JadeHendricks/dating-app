
using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface ILikesRepository
    {
        Task<UserLike> GetUserLike(int sourceUserId, int targetUserId);
        Task<AppUser> GetUserWithLikes(int userId);
        //predicate - do we want to get the user that like or the user that was like by
        Task<IEnumerable<LikeDto>> GetUserLikes(string predicate, int userId);
    }
}