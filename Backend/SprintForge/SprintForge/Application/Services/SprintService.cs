using Microsoft.EntityFrameworkCore;
using SprintForge.Application.Interfaces;
using SprintForge.Domain.Entities;
using SprintForge.Dtos;
using SprintForge.Exceptions;
using SprintForge.Infrastructure;

namespace SprintForge.Application.Services;

public class SprintService : ISprintService
{
    private readonly AppDbContext _context;
    private readonly ILogger<SprintService> _logger;

    public SprintService(AppDbContext context, ILogger<SprintService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Sprint> CreateSprint(CreateSprintDto dto, Guid userId)
    {
        if (dto.EndDate <= dto.StartDate)
            throw new Exception("EndDate must be after StartDate");

        var sprint = new Sprint
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            Goal = dto.Goal,
            StartDate = DateTime.SpecifyKind(dto.StartDate, DateTimeKind.Utc),
            EndDate = DateTime.SpecifyKind(dto.EndDate, DateTimeKind.Utc),
            Status = "Planned",
            UserId = userId
        };

        _context.Sprints.Add(sprint);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Sprint {SprintId} created by user {UserId}", sprint.Id, userId);
        return sprint;
    }

    public async Task<object> GetSprintProgress(Guid sprintId, Guid userId)
    {
        var sprint = await _context.Sprints.FirstOrDefaultAsync(s => s.Id == sprintId);

        if (sprint == null)
        {
            _logger.LogWarning("Sprint {SprintId} not found", sprintId);
            throw new NotFoundException("Sprint not found");
        }

        if (sprint.UserId != userId)
        {
            _logger.LogWarning("User {UserId} tried to access sprint {SprintId} owned by {OwnerId}", userId, sprintId, sprint.UserId);
            throw new ForbiddenException("You do not own this sprint");
        }

        var tasks = await _context.SprintTasks
            .Where(t => t.SprintId == sprintId)
            .ToListAsync();

        var total = tasks.Count;
        var done = tasks.Count(t => t.Status == "Done");
        var inProgress = tasks.Count(t => t.Status == "InProgress");
        var todo = tasks.Count(t => t.Status == "Todo");
        var percentage = total == 0 ? 0 : (int)Math.Round((double)done / total * 100);

        return new { total, done, inProgress, todo, percentage };
    }

    public async Task<List<Sprint>> GetMySprints(Guid userId)
    {
        return await _context.Sprints
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.StartDate)
            .ToListAsync();
    }

    public async Task<Sprint> UpdateSprint(Guid sprintId, UpdateSprintDto dto, Guid userId)
    {
        var sprint = await _context.Sprints.FirstOrDefaultAsync(s => s.Id == sprintId);

        if (sprint == null)
        {
            _logger.LogWarning("Sprint {SprintId} not found", sprintId);
            throw new NotFoundException("Sprint not found");
        }

        if (sprint.UserId != userId)
        {
            _logger.LogWarning("User {UserId} tried to update sprint {SprintId} owned by {OwnerId}", userId, sprintId, sprint.UserId);
            throw new ForbiddenException("You do not own this sprint");
        }

        if (dto.EndDate <= dto.StartDate)
            throw new Exception("EndDate must be after StartDate");

        sprint.Title = dto.Title;
        sprint.Description = dto.Description;
        sprint.Goal = dto.Goal;
        sprint.StartDate = DateTime.SpecifyKind(dto.StartDate, DateTimeKind.Utc);
        sprint.EndDate = DateTime.SpecifyKind(dto.EndDate, DateTimeKind.Utc);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Sprint {SprintId} updated by user {UserId}", sprintId, userId);
        return sprint;
    }

    public async Task DeleteSprint(Guid sprintId, Guid userId)
    {
        var sprint = await _context.Sprints
            .Include(s => s.Tasks)
                .ThenInclude(t => t.Artifacts)
            .FirstOrDefaultAsync(s => s.Id == sprintId);

        if (sprint == null)
        {
            _logger.LogWarning("Sprint {SprintId} not found", sprintId);
            throw new NotFoundException("Sprint not found");
        }

        if (sprint.UserId != userId)
        {
            _logger.LogWarning("User {UserId} tried to delete sprint {SprintId} owned by {OwnerId}", userId, sprintId, sprint.UserId);
            throw new ForbiddenException("You do not own this sprint");
        }

        _context.Sprints.Remove(sprint);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Sprint {SprintId} deleted by user {UserId}", sprintId, userId);
    }

    public async Task<Sprint> UpdateSprintStatus(Guid sprintId, string status, Guid userId)
    {
        var sprint = await _context.Sprints.FirstOrDefaultAsync(s => s.Id == sprintId);

        if (sprint == null)
        {
            _logger.LogWarning("Sprint {SprintId} not found", sprintId);
            throw new NotFoundException("Sprint not found");
        }

        if (sprint.UserId != userId)
        {
            _logger.LogWarning("User {UserId} tried to update status of sprint {SprintId} owned by {OwnerId}", userId, sprintId, sprint.UserId);
            throw new ForbiddenException("You do not own this sprint");
        }

        sprint.Status = status;
        await _context.SaveChangesAsync();

        _logger.LogInformation("Sprint {SprintId} status changed to {Status} by user {UserId}", sprintId, status, userId);
        return sprint;
    }
}
