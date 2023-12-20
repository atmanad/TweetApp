namespace TweetApp.Backend.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository User { get; }
        ITweetRepository Tweet { get; }
        ILikeRepository Like { get; }
        ITweetReplyRepository TweetReply { get; }
        Task Save();
    }
}
