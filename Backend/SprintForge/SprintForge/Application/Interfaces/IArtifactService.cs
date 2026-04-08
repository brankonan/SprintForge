using SprintForge.Domain.Entities;
using SprintForge.Dtos;

namespace SprintForge.Application.Interfaces;

public interface IArtifactService
{
    Task<Artifact> CreateArtifact(Guid taskId, CreateArtifactDto dto, Guid userId);
    Task<List<Artifact>> GetArtifactsByTask(Guid taskId, Guid userId);
    Task DeleteArtifact(Guid artifactId, Guid userId);
}
