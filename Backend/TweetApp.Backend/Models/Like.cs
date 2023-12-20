using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TweetApp.Backend.Models
{
    public class Like
    {
        [Key]
        public int Id { get; set; }
        public int TweetId { get; set; }
        public string UserId { get; set; }
    }
}
