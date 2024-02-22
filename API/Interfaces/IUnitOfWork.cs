namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository {get;}
        IMessageRepository MessageRepository {get;}
        ILikesRepository LikesRepository {get;}
        Task<bool> Complete();
        //this will track if entity fraemwork is tracking any changes in the transaction
        bool HasChanges();
    }
}