using SprintForge.Domain.Entities;
using SprintForge.Dtos;

namespace SprintForge.Application.Interfaces;

public interface ISprintService
{
    Task<Sprint> CreateSprint(CreateSprintDto dto, Guid userId);
    Task<object> GetSprintProgress(Guid sprintId, Guid userId);
    Task<List<Sprint>> GetMySprints(Guid userId);
    Task<Sprint> UpdateSprint(Guid sprintId, UpdateSprintDto dto, Guid userId);
    Task DeleteSprint(Guid sprintId, Guid userId);
    Task<Sprint> UpdateSprintStatus(Guid sprintId, string status, Guid userId);
}
