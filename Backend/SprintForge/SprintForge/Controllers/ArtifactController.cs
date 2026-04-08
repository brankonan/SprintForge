using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SprintForge.Application.Interfaces;
using SprintForge.Dtos;
using System.Security.Claims;

namespace SprintForge.Controllers;

[ApiController]
[Route("api/tasks/{taskId}/artifacts")]
[Authorize]
public class ArtifactController : ControllerBase
{
    private readonly IArtifactService _artifactService;

    public ArtifactController(IArtifactService artifactService)
    {
        _artifactService = artifactService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateArtifact(Guid taskId, CreateArtifactDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            var artifact = await _artifactService.CreateArtifact(taskId, dto, userId);

            return Ok(new
            {
                artifact.Id,
                artifact.Title,
                artifact.Url,
                artifact.Type,
                artifact.Description,
                artifact.SprintTaskId
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

    [HttpGet]
    public async Task<IActionResult> GetArtifacts(Guid taskId)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            var artifacts = await _artifactService.GetArtifactsByTask(taskId, userId);

            var result = artifacts.Select(a => new
            {
                a.Id,
                a.Title,
                a.Url,
                a.Type,
                a.Description,
                a.SprintTaskId
            });

            return Ok(result);
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

    [HttpDelete("/api/artifacts/{artifactId}")]
    public async Task<IActionResult> DeleteArtifact(Guid artifactId)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            await _artifactService.DeleteArtifact(artifactId, userId);
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
