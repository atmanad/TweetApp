using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TweetApp.Backend.Models
{
    public class Tweet
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [MaxLength(50)]
        public string Tag { get; set; }

        [MaxLength(144)]
        public string Subject { get; set; }

        public string UserId { get; set; }
        [ForeignKey("UserId")]

        public User User { get; set; }
        public DateTime DatePosted { get; set; } = DateTime.Now;

    }
}
