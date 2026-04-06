using Microsoft.EntityFrameworkCore;
using SprintForge.Application.Interfaces;
using SprintForge.Domain.Entities;
using SprintForge.Dtos;
using SprintForge.Infrastructure;

namespace SprintForge.Application.Services;

public class SprintService : ISprintService
{
    private readonly AppDbContext _context;

    public SprintService(AppDbContext context)
    {
        _context = context;
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

        return sprint;
    }

    public async Task<object> GetSprintProgress(Guid sprintId, Guid userId)
    {
        var sprint = await _context.Sprints.FirstOrDefaultAsync(s => s.Id == sprintId);

        if (sprint == null)
            throw new Exception("Sprint not found");

        if (sprint.UserId != userId)
            throw new UnauthorizedAccessException("You do not own this sprint");

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
}
