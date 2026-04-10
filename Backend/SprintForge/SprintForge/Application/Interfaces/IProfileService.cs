using SprintForge.Domain.Entities;
using SprintForge.Dtos;

namespace SprintForge.Application.Interfaces;

public interface IProfileService
{
    Task<User> GetProfile(Guid userId);
    Task<User> UpdateProfile(Guid userId, UpdateProfileDto dto);
}
