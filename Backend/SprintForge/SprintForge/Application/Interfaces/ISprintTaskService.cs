using SprintForge.Domain.Entities;
using SprintForge.Dtos;

namespace SprintForge.Application.Interfaces;

public interface ISprintTaskService
{
    Task<SprintTask> CreateTask(Guid sprintId, CreateSprintTaskDto dto, Guid userId);
    Task<SprintTask> UpdateTaskStatus(Guid sprintId, Guid taskId, string status, Guid userId);
    Task<SprintTask> UpdateTask(Guid taskId, UpdateSprintTaskDto dto, Guid userId);
    Task DeleteTask(Guid taskId, Guid userId);
    Task<List<SprintTask>> GetTasksBySprint(Guid sprintId, Guid userId);
}
