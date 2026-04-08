using SprintForge.Dtos;

namespace SprintForge.Application.Interfaces;

public interface IUserService
{
    Task<List<PublicUserDto>> GetPublicUsers(string? search, int limit);
    Task<PublicPortfolioDto?> GetPublicPortfolio(Guid userId);
}
