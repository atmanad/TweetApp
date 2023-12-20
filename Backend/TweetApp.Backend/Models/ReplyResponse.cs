namespace TweetApp.Backend.Models
{
    public class ReplyResponse
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public int TweetId { get; set; }
        public string Message { get; set; }
        public DateTime DatePosted { get; set; }
    }
}
