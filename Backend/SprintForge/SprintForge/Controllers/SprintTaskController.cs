using AutoMapper;
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
    private readonly IMapper _mapper;

    public SprintTaskController(ISprintTaskService sprintTaskService, IMapper mapper)
    {
        _sprintTaskService = sprintTaskService;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask(Guid sprintId, CreateSprintTaskDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var task = await _sprintTaskService.CreateTask(sprintId, dto, userId);
        return Ok(_mapper.Map<SprintTaskResponseDto>(task));
    }

    [HttpPatch("{taskId}/status")]
    public async Task<IActionResult> UpdateTaskStatus(Guid sprintId, Guid taskId, [FromBody] UpdateTaskStatusDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var task = await _sprintTaskService.UpdateTaskStatus(sprintId, taskId, dto.Status, userId);
        return Ok(_mapper.Map<SprintTaskResponseDto>(task));
    }

    [HttpGet]
    public async Task<IActionResult> GetTasks(Guid sprintId)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var tasks = await _sprintTaskService.GetTasksBySprint(sprintId, userId);
        return Ok(_mapper.Map<List<SprintTaskResponseDto>>(tasks));
    }

    [HttpPut("/api/tasks/{taskId}")]
    public async Task<IActionResult> UpdateTask(Guid taskId, [FromBody] UpdateSprintTaskDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var task = await _sprintTaskService.UpdateTask(taskId, dto, userId);
        return Ok(_mapper.Map<SprintTaskResponseDto>(task));
    }

    [HttpDelete("/api/tasks/{taskId}")]
    public async Task<IActionResult> DeleteTask(Guid taskId)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        await _sprintTaskService.DeleteTask(taskId, userId);
        return NoContent();
    }
}
