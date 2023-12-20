using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TweetApp.Backend.Models
{
    public class TweetReply
    {
        [Key]
        public int Id { get; set; }
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public int TweetId { get; set; }
        [ForeignKey("TweetId")]

        public string Message { get; set; }

        public DateTime DatePosted { get; set; } = DateTime.Now;
    }
}
