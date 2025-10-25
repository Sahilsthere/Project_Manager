using MiniPM.Api.Models;

namespace MiniPM.Api.Services
{
    public interface IAuthService
    {
        void CreatePasswordHash(string password, out byte[] hash, out byte[] salt);
        bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt);
        string CreateToken(User user);
    }
}
