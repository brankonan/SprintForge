using Microsoft.EntityFrameworkCore;
using SprintForge.Application.Interfaces;
using SprintForge.Domain.Entities;
using SprintForge.Dtos;
using SprintForge.Infrastructure;

namespace SprintForge.Application.Services;

public class ArtifactService : IArtifactService
{
    private readonly AppDbContext _context;

    public ArtifactService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Artifact> CreateArtifact(Guid taskId, CreateArtifactDto dto, Guid userId)
    {
        var task = await _context.SprintTasks
            .Include(t => t.Sprint)
            .FirstOrDefaultAsync(t => t.Id == taskId);

        if (task == null)
            throw new Exception("Task not found");

        if (task.Sprint.UserId != userId)
            throw new UnauthorizedAccessException("You do not own this sprint");

        var artifact = new Artifact
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Url = dto.Url,
            Type = dto.Type,
            Description = dto.Description,
            SprintTaskId = taskId
        };

        _context.Artifacts.Add(artifact);
        await _context.SaveChangesAsync();

        return artifact;
    }

    public async Task<List<Artifact>> GetArtifactsByTask(Guid taskId, Guid userId)
    {
        var task = await _context.SprintTasks
            .Include(t => t.Sprint)
            .FirstOrDefaultAsync(t => t.Id == taskId);

        if (task == null)
            throw new Exception("Task not found");

        if (task.Sprint.UserId != userId)
            throw new UnauthorizedAccessException("You do not own this sprint");

        return await _context.Artifacts
            .Where(a => a.SprintTaskId == taskId)
            .OrderBy(a => a.Title)
            .ToListAsync();
    }

    public async Task DeleteArtifact(Guid artifactId, Guid userId)
    {
        var artifact = await _context.Artifacts
            .Include(a => a.SprintTask)
            .ThenInclude(t => t.Sprint)
            .FirstOrDefaultAsync(a => a.Id == artifactId);

        if (artifact == null)
            throw new Exception("Artifact not found");

        if (artifact.SprintTask.Sprint.UserId != userId)
            throw new UnauthorizedAccessException("You do not own this sprint");

        _context.Artifacts.Remove(artifact);
        await _context.SaveChangesAsync();
    }
}
