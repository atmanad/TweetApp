using TweetApp.Backend.Interfaces;
using TweetApp.Backend.Models;

namespace TweetApp.Backend.Repository
{
    public class TweetRepository : GenericRepository<Tweet>, ITweetRepository
    {
        public TweetRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
