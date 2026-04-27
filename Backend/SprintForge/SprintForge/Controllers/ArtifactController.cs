using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SprintForge.Application.Interfaces;
using SprintForge.Dtos;
using System.Security.Claims;

namespace SprintForge.Controllers;

[ApiController]
[Route("api/tasks/{taskId}/artifacts")]
[Authorize(Roles = "Student")]
public class ArtifactController : ControllerBase
{
    private readonly IArtifactService _artifactService;
    private readonly IMapper _mapper;

    public ArtifactController(IArtifactService artifactService, IMapper mapper)
    {
        _artifactService = artifactService;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<IActionResult> CreateArtifact(Guid taskId, CreateArtifactDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var artifact = await _artifactService.CreateArtifact(taskId, dto, userId);
        return Ok(_mapper.Map<ArtifactResponseDto>(artifact));
    }

    [HttpGet]
    public async Task<IActionResult> GetArtifacts(Guid taskId)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var artifacts = await _artifactService.GetArtifactsByTask(taskId, userId);
        return Ok(_mapper.Map<List<ArtifactResponseDto>>(artifacts));
    }

    [HttpDelete("/api/artifacts/{artifactId}")]
    public async Task<IActionResult> DeleteArtifact(Guid artifactId)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        await _artifactService.DeleteArtifact(artifactId, userId);
        return NoContent();
    }
}
