using TweetApp.Backend.Interfaces;
using TweetApp.Backend.Models;

namespace TweetApp.Backend.Repository
{
    public class TweetReplyRepository : GenericRepository<TweetReply>, ITweetReplyRepository
    {
        public TweetReplyRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
