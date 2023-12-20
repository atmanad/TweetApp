using TweetApp.Backend.Interfaces;

namespace TweetApp.Backend.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            User = new UserRepository(_context);
            Tweet = new TweetRepository(_context);
            Like = new LikeRepository(_context);
            TweetReply = new TweetReplyRepository(_context);

        }

        public IUserRepository User { get; private set; }
        public ITweetRepository Tweet { get; private set; }
        public ILikeRepository Like { get; private set; }
        public ITweetReplyRepository TweetReply { get; private set; }

        public void Dispose()
        {
            _context.Dispose();
        }

        public Task Save()
        {
            return _context.SaveChangesAsync();
        }
    }
}
