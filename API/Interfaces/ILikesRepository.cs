
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface ILikesRepository
    {
        Task<UserLike> GetUserLike(int sourceUserId, int targetUserId);
        Task<AppUser> GetUserWithLikes(int userId);
        //predicate - do we want to get the user that like or the user that was like by
        Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams);
    }
}