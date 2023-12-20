using System.ComponentModel.DataAnnotations;

namespace TweetApp.Backend.Dto
{
    public class LoginDto
    {
        [DataType(DataType.EmailAddress)]
        public string Username { get; set; }
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
