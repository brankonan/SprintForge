using AutoMapper;
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
    private readonly IMapper _mapper;

    public SprintController(ISprintService sprintService, IMapper mapper)
    {
        _sprintService = sprintService;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<IActionResult> CreateSprint(CreateSprintDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var sprint = await _sprintService.CreateSprint(dto, userId);
        return Ok(_mapper.Map<SprintResponseDto>(sprint));
    }

    [HttpGet("{id}/progress")]
    public async Task<IActionResult> GetSprintProgress(Guid id)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var progress = await _sprintService.GetSprintProgress(id, userId);
        return Ok(progress);
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMySprints()
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var sprints = await _sprintService.GetMySprints(userId);
        return Ok(_mapper.Map<List<SprintResponseDto>>(sprints));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSprint(Guid id, UpdateSprintDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var sprint = await _sprintService.UpdateSprint(id, dto, userId);
        return Ok(_mapper.Map<SprintResponseDto>(sprint));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSprint(Guid id)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        await _sprintService.DeleteSprint(id, userId);
        return NoContent();
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateSprintStatus(Guid id, [FromBody] UpdateSprintStatusDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var sprint = await _sprintService.UpdateSprintStatus(id, dto.Status, userId);
        return Ok(_mapper.Map<SprintResponseDto>(sprint));
    }
}
