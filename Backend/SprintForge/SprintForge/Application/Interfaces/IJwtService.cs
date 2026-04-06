using SprintForge.Domain.Entities;

namespace SprintForge.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}
