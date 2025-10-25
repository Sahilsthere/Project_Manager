using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using MiniPM.Api.Data;
using MiniPM.Api.DTOs;
using MiniPM.Api.Models;

namespace MiniPM.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public ProjectsController(AppDbContext db) { _db = db; }

        private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var projects = await _db.Projects
                .Where(p => p.UserId == UserId)
                .Select(p => new ProjectDto {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    CreatedAt = p.CreatedAt
                }).ToListAsync();
            return Ok(projects);
        }

        [HttpPost]
        public async Task<IActionResult> Create(ProjectCreateDto dto)
        {
            var proj = new Project
            {
                Title = dto.Title,
                Description = dto.Description,
                UserId = UserId
            };
            _db.Projects.Add(proj);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = proj.Id }, new ProjectDto {
                Id = proj.Id,
                Title = proj.Title,
                Description = proj.Description,
                CreatedAt = proj.CreatedAt
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var proj = await _db.Projects.Include(p => p.Tasks)
                .FirstOrDefaultAsync(p => p.Id == id && p.UserId == UserId);
            if (proj == null) return NotFound();
            var result = new {
                Id = proj.Id,
                Title = proj.Title,
                Description = proj.Description,
                CreatedAt = proj.CreatedAt,
                Tasks = proj.Tasks.Select(t => new {
                    t.Id, t.Title, t.DueDate, t.IsCompleted, t.ProjectId
                })
            };
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var proj = await _db.Projects.FirstOrDefaultAsync(p => p.Id == id && p.UserId == UserId);
            if (proj == null) return NotFound();
            _db.Projects.Remove(proj);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
