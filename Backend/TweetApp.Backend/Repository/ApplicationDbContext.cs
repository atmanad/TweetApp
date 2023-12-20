using Microsoft.EntityFrameworkCore;
using TweetApp.Backend.Models;

namespace TweetApp.Backend.Repository
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Tweet> Tweets { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<TweetReply> TweetReplies { get; set; }
    }
}
