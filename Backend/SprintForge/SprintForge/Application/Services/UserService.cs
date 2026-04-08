using Microsoft.EntityFrameworkCore;
using SprintForge.Application.Interfaces;
using SprintForge.Dtos;
using SprintForge.Infrastructure;

namespace SprintForge.Application.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<PublicUserDto>> GetPublicUsers(string? search, int limit)
    {
        var query = _context.Users
            .Where(u => u.IsPortfolioPublic);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.ToLower();
            query = query.Where(u =>
                u.FirstName.ToLower().Contains(term) ||
                u.LastName.ToLower().Contains(term));
        }

        return await query
            .OrderByDescending(u => u.CreatedAt)
            .Take(limit)
            .Select(u => new PublicUserDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Role = u.Role,
                Bio = u.Bio,
                SprintCount = u.Sprints.Count
            })
            .ToListAsync();
    }

    public async Task<PublicPortfolioDto?> GetPublicPortfolio(Guid userId)
    {
        var user = await _context.Users
            .Include(u => u.Sprints)
                .ThenInclude(s => s.Tasks)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null || !user.IsPortfolioPublic)
            return null;

        return new PublicPortfolioDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role,
            Bio = user.Bio,
            Sprints = user.Sprints
                .OrderByDescending(s => s.StartDate)
                .Select(s => new PortfolioSprintDto
                {
                    Id = s.Id,
                    Title = s.Title,
                    Goal = s.Goal,
                    Status = s.Status,
                    StartDate = s.StartDate,
                    EndDate = s.EndDate,
                    TaskCount = s.Tasks.Count,
                    DoneCount = s.Tasks.Count(t => t.Status == "Done")
                })
                .ToList()
        };
    }
}
