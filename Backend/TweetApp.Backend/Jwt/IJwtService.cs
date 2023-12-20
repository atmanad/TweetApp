using TweetApp.Backend.Dto;

namespace TweetApp.Backend.Jwt
{
    public interface IJwtService
    {
        string GenerateToken(LoginDto model);
    }
}
