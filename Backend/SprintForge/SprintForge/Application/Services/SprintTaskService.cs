using Microsoft.EntityFrameworkCore;
using SprintForge.Application.Interfaces;
using SprintForge.Domain.Entities;
using SprintForge.Dtos;
using SprintForge.Infrastructure;

namespace SprintForge.Application.Services;

public class SprintTaskService : ISprintTaskService
{
    private readonly AppDbContext _context;

    public SprintTaskService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<SprintTask> CreateTask(Guid sprintId, CreateSprintTaskDto dto, Guid userId)
    {
        var sprint = await _context.Sprints.FirstOrDefaultAsync(s => s.Id == sprintId);

        if (sprint == null)
            throw new Exception("Sprint not found");

        if (sprint.UserId != userId)
            throw new UnauthorizedAccessException("You do not own this sprint");

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

        return task;
    }

    public async Task<SprintTask> UpdateTaskStatus(Guid sprintId, Guid taskId, string status, Guid userId)
    {
        var sprint = await _context.Sprints.FirstOrDefaultAsync(s => s.Id == sprintId);

        if (sprint == null)
            throw new Exception("Sprint not found");

        if (sprint.UserId != userId)
            throw new UnauthorizedAccessException("You do not own this sprint");

        var task = await _context.SprintTasks.FirstOrDefaultAsync(t => t.Id == taskId && t.SprintId == sprintId);

        if (task == null)
            throw new Exception("Task not found");

        task.Status = status;
        await _context.SaveChangesAsync();

        return task;
    }

    public async Task<SprintTask> UpdateTask(Guid taskId, UpdateSprintTaskDto dto, Guid userId)
    {
        var task = await _context.SprintTasks.Include(t => t.Sprint).FirstOrDefaultAsync(t => t.Id == taskId);

        if (task == null)
            throw new Exception("Task not found");

        if (task.Sprint.UserId != userId)
            throw new UnauthorizedAccessException("You do not own this sprint");

        task.Title = dto.Title;
        task.Description = dto.Description;
        task.Priority = dto.Priority;
        await _context.SaveChangesAsync();

        return task;
    }

    public async Task DeleteTask(Guid taskId, Guid userId)
    {
        var task = await _context.SprintTasks.Include(t => t.Sprint).FirstOrDefaultAsync(t => t.Id == taskId);

        if (task == null)
            throw new Exception("Task not found");

        if (task.Sprint.UserId != userId)
            throw new UnauthorizedAccessException("You do not own this sprint");

        _context.SprintTasks.Remove(task);
        await _context.SaveChangesAsync();
    }

    public async Task<List<SprintTask>> GetTasksBySprint(Guid sprintId, Guid userId)
    {
        var sprint = await _context.Sprints.FirstOrDefaultAsync(s => s.Id == sprintId);

        if (sprint == null)
            throw new Exception("Sprint not found");

        if (sprint.UserId != userId)
            throw new UnauthorizedAccessException("You do not own this sprint");

        return await _context.SprintTasks
            .Where(t => t.SprintId == sprintId)
            .OrderBy(t => t.Status)
            .ThenByDescending(t => t.Priority)
            .ToListAsync();
    }
}
