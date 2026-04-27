using Microsoft.EntityFrameworkCore;
using SprintForge.Application.Interfaces;
using SprintForge.Domain.Entities;
using SprintForge.Dtos;
using SprintForge.Exceptions;
using SprintForge.Infrastructure;

namespace SprintForge.Application.Services;

public class SprintTaskService : ISprintTaskService
{
    private readonly AppDbContext _context;
    private readonly ILogger<SprintTaskService> _logger;

    public SprintTaskService(AppDbContext context, ILogger<SprintTaskService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<SprintTask> CreateTask(Guid sprintId, CreateSprintTaskDto dto, Guid userId)
    {
        var sprint = await _context.Sprints.FirstOrDefaultAsync(s => s.Id == sprintId);

        if (sprint == null)
        {
            _logger.LogWarning("Sprint {SprintId} not found when creating task", sprintId);
            throw new NotFoundException("Sprint not found");
        }

        if (sprint.UserId != userId)
        {
            _logger.LogWarning("User {UserId} tried to add task to sprint {SprintId} owned by {OwnerId}", userId, sprintId, sprint.UserId);
            throw new ForbiddenException("You do not own this sprint");
        }

        var task = new SprintTask
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            Priority = dto.Priority,
            DueDate = dto.DueDate.HasValue ? DateTime.SpecifyKind(dto.DueDate.Value, DateTimeKind.Utc) : null,
            Status = "Todo",
            SprintId = sprintId
        };

        _context.SprintTasks.Add(task);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Task {TaskId} created in sprint {SprintId} by user {UserId}", task.Id, sprintId, userId);
        return task;
    }

    public async Task<SprintTask> UpdateTaskStatus(Guid sprintId, Guid taskId, string status, Guid userId)
    {
        var sprint = await _context.Sprints.FirstOrDefaultAsync(s => s.Id == sprintId);

        if (sprint == null)
        {
            _logger.LogWarning("Sprint {SprintId} not found", sprintId);
            throw new NotFoundException("Sprint not found");
        }

        if (sprint.UserId != userId)
        {
            _logger.LogWarning("User {UserId} tried to update task status in sprint {SprintId} owned by {OwnerId}", userId, sprintId, sprint.UserId);
            throw new ForbiddenException("You do not own this sprint");
        }

        var task = await _context.SprintTasks.FirstOrDefaultAsync(t => t.Id == taskId && t.SprintId == sprintId);

        if (task == null)
        {
            _logger.LogWarning("Task {TaskId} not found in sprint {SprintId}", taskId, sprintId);
            throw new NotFoundException("Task not found");
        }

        task.Status = status;
        await _context.SaveChangesAsync();

        return task;
    }

    public async Task<SprintTask> UpdateTask(Guid taskId, UpdateSprintTaskDto dto, Guid userId)
    {
        var task = await _context.SprintTasks.Include(t => t.Sprint).FirstOrDefaultAsync(t => t.Id == taskId);

        if (task == null)
        {
            _logger.LogWarning("Task {TaskId} not found", taskId);
            throw new NotFoundException("Task not found");
        }

        if (task.Sprint.UserId != userId)
        {
            _logger.LogWarning("User {UserId} tried to update task {TaskId} owned by {OwnerId}", userId, taskId, task.Sprint.UserId);
            throw new ForbiddenException("You do not own this sprint");
        }

        task.Title = dto.Title;
        task.Description = dto.Description;
        task.Priority = dto.Priority;
        await _context.SaveChangesAsync();

        _logger.LogInformation("Task {TaskId} updated by user {UserId}", taskId, userId);
        return task;
    }

    public async Task DeleteTask(Guid taskId, Guid userId)
    {
        var task = await _context.SprintTasks.Include(t => t.Sprint).FirstOrDefaultAsync(t => t.Id == taskId);

        if (task == null)
        {
            _logger.LogWarning("Task {TaskId} not found", taskId);
            throw new NotFoundException("Task not found");
        }

        if (task.Sprint.UserId != userId)
        {
            _logger.LogWarning("User {UserId} tried to delete task {TaskId} owned by {OwnerId}", userId, taskId, task.Sprint.UserId);
            throw new ForbiddenException("You do not own this sprint");
        }

        _context.SprintTasks.Remove(task);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Task {TaskId} deleted by user {UserId}", taskId, userId);
    }

    public async Task<List<SprintTask>> GetTasksBySprint(Guid sprintId, Guid userId)
    {
        var sprint = await _context.Sprints.FirstOrDefaultAsync(s => s.Id == sprintId);

        if (sprint == null)
        {
            _logger.LogWarning("Sprint {SprintId} not found", sprintId);
            throw new NotFoundException("Sprint not found");
        }

        if (sprint.UserId != userId)
        {
            _logger.LogWarning("User {UserId} tried to get tasks for sprint {SprintId} owned by {OwnerId}", userId, sprintId, sprint.UserId);
            throw new ForbiddenException("You do not own this sprint");
        }

        return await _context.SprintTasks
            .Include(t => t.Artifacts)
            .Where(t => t.SprintId == sprintId)
            .OrderBy(t => t.Status)
            .ThenByDescending(t => t.Priority)
            .ToListAsync();
    }
}
