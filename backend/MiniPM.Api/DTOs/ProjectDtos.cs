using System.ComponentModel.DataAnnotations;

namespace MiniPM.Api.DTOs
{
    public class ProjectCreateDto
    {
        [Required, StringLength(100, MinimumLength = 3)]
        public string Title { get; set; } = null!;

        [StringLength(500)]
        public string? Description { get; set; }
    }

    public class ProjectDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
