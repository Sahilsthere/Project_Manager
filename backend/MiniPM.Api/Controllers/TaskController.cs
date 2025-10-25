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
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _db;
        public TasksController(AppDbContext db) { _db = db; }

        private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpPost("api/projects/{projectId}/tasks")]
        public async Task<IActionResult> AddTask(int projectId, TaskCreateDto dto)
        {
            var proj = await _db.Projects.FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == UserId);
            if (proj == null) return NotFound("Project not found");

            var task = new TaskItem { Title = dto.Title, DueDate = dto.DueDate, ProjectId = projectId };
            _db.Tasks.Add(task);
            await _db.SaveChangesAsync();
            return CreatedAtAction(null, new { id = task.Id }, new {
                task.Id, task.Title, task.DueDate, task.IsCompleted, task.ProjectId
            });
        }

        [HttpPut("api/tasks/{taskId}")]
        public async Task<IActionResult> UpdateTask(int taskId, TaskUpdateDto dto)
        {
            var task = await _db.Tasks.Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.Project!.UserId == UserId);
            if (task == null) return NotFound();

            task.Title = dto.Title;
            task.DueDate = dto.DueDate;
            task.IsCompleted = dto.IsCompleted;
            await _db.SaveChangesAsync();
            return Ok(new { task.Id, task.Title, task.DueDate, task.IsCompleted, task.ProjectId });
        }

        [HttpDelete("api/tasks/{taskId}")]
        public async Task<IActionResult> DeleteTask(int taskId)
        {
            var task = await _db.Tasks.Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.Project!.UserId == UserId);
            if (task == null) return NotFound();

            _db.Tasks.Remove(task);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
