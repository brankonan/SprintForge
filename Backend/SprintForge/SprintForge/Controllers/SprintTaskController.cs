using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SprintForge.Application.Interfaces;
using SprintForge.Dtos;
using System.Security.Claims;

namespace SprintForge.Controllers;

[ApiController]
[Route("api/sprints/{sprintId}/tasks")]
[Authorize(Roles = "Student")]
public class SprintTaskController : ControllerBase
{
    private readonly ISprintTaskService _sprintTaskService;

    public SprintTaskController(ISprintTaskService sprintTaskService)
    {
        _sprintTaskService = sprintTaskService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask(Guid sprintId, CreateSprintTaskDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            var task = await _sprintTaskService.CreateTask(sprintId, dto, userId);

            return Ok(new
            {
                task.Id,
                task.Title,
                task.Description,
                task.Status,
                task.Priority,
                task.DueDate,
                task.SprintId
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPatch("{taskId}/status")]
    public async Task<IActionResult> UpdateTaskStatus(Guid sprintId, Guid taskId, [FromBody] UpdateTaskStatusDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            var task = await _sprintTaskService.UpdateTaskStatus(sprintId, taskId, dto.Status, userId);

            return Ok(new
            {
                task.Id,
                task.Title,
                task.Description,
                task.Status,
                task.Priority,
                task.DueDate,
                task.SprintId
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetTasks(Guid sprintId)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var tasks = await _sprintTaskService.GetTasksBySprint(sprintId, userId);

        var result = tasks.Select(t => new
        {
            t.Id,
            t.Title,
            t.Description,
            t.Status,
            t.Priority,
            t.DueDate,
            t.SprintId,
            Artifacts = t.Artifacts.Select(a => new
            {
                a.Id,
                a.Title,
                a.Url,
                a.Type,
                a.Description
            })
        });

        return Ok(result);
    }

    [HttpPut("/api/tasks/{taskId}")]
    public async Task<IActionResult> UpdateTask(Guid taskId, [FromBody] UpdateSprintTaskDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            var task = await _sprintTaskService.UpdateTask(taskId, dto, userId);

            return Ok(new
            {
                task.Id,
                task.Title,
                task.Description,
                task.Status,
                task.Priority,
                task.DueDate,
                task.SprintId
            });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("/api/tasks/{taskId}")]
    public async Task<IActionResult> DeleteTask(Guid taskId)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            await _sprintTaskService.DeleteTask(taskId, userId);
            return NoContent();
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
