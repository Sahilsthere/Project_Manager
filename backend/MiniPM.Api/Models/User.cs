using System.ComponentModel.DataAnnotations;

namespace MiniPM.Api.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required, StringLength(100, MinimumLength = 3)]
        public string Username { get; set; } = null!;

        [Required]
        public byte[] PasswordHash { get; set; } = null!;

        [Required]
        public byte[] PasswordSalt { get; set; } = null!;

        public List<Project> Projects { get; set; } = new();
    }
}
