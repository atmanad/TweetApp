using TweetApp.Backend.Dto;
using TweetApp.Backend.Interfaces;
using TweetApp.Backend.Models;

namespace TweetApp.Backend.Repository
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context) : base(context)
        {
        }
        public async Task<bool> IsUniqueUser(string username)
        {
            var user = await Get(x => x.Email == username);
            return user == null;
        }
    }
}
