using TweetApp.Backend.Dto;
using TweetApp.Backend.Models;

namespace TweetApp.Backend.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<bool> IsUniqueUser(string username);
    }
}
