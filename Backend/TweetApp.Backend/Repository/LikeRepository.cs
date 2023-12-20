using TweetApp.Backend.Interfaces;
using TweetApp.Backend.Models;

namespace TweetApp.Backend.Repository
{
    public class LikeRepository : GenericRepository<Like>, ILikeRepository
    {
        public LikeRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
