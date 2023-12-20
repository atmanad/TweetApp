using System.ComponentModel.DataAnnotations;

namespace TweetApp.Backend.Models
{
    public class TweetCreate
    {
        [MaxLength(50)]
        public string Tag { get; set; }

        [MaxLength(144)]
        [Required]
        public string Subject { get; set; }
    }
}
