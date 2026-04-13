using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SprintForge.Application.Interfaces;
using SprintForge.Dtos;
using System.Security.Claims;

namespace SprintForge.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Student")]
public class SprintController : ControllerBase
{
    private readonly ISprintService _sprintService;

    public SprintController(ISprintService sprintService)
    {
        _sprintService = sprintService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateSprint(CreateSprintDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            var sprint = await _sprintService.CreateSprint(dto, userId);

            return Ok(new
            {
                sprint.Id,
                sprint.Title,
                sprint.Description,
                sprint.Goal,
                sprint.StartDate,
                sprint.EndDate,
                sprint.Status
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}/progress")]
    public async Task<IActionResult> GetSprintProgress(Guid id)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            var progress = await _sprintService.GetSprintProgress(id, userId);
            return Ok(progress);
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

    [HttpGet("my")]
    public async Task<IActionResult> GetMySprints()
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var sprints = await _sprintService.GetMySprints(userId);

        var result = sprints.Select(s => new
        {
            s.Id,
            s.Title,
            s.Description,
            s.Goal,
            s.StartDate,
            s.EndDate,
            s.Status
        });

        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSprint(Guid id, UpdateSprintDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            var sprint = await _sprintService.UpdateSprint(id, dto, userId);

            return Ok(new
            {
                sprint.Id,
                sprint.Title,
                sprint.Description,
                sprint.Goal,
                sprint.StartDate,
                sprint.EndDate,
                sprint.Status
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

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSprint(Guid id)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            await _sprintService.DeleteSprint(id, userId);
            return NoContent();
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

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateSprintStatus(Guid id, [FromBody] UpdateSprintStatusDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            var sprint = await _sprintService.UpdateSprintStatus(id, dto.Status, userId);

            return Ok(new
            {
                sprint.Id,
                sprint.Title,
                sprint.Description,
                sprint.Goal,
                sprint.StartDate,
                sprint.EndDate,
                sprint.Status
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
}
