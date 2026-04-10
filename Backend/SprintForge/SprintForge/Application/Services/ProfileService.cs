using Microsoft.EntityFrameworkCore;
using SprintForge.Application.Interfaces;
using SprintForge.Domain.Entities;
using SprintForge.Dtos;
using SprintForge.Infrastructure;

namespace SprintForge.Application.Services;

public class ProfileService : IProfileService
{
    private readonly AppDbContext _context;

    public ProfileService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User> GetProfile(Guid userId)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            throw new Exception("User not found");

        return user;
    }

    public async Task<User> UpdateProfile(Guid userId, UpdateProfileDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            throw new Exception("User not found");

        user.Bio = dto.Bio;
        user.IsPortfolioPublic = dto.IsPortfolioPublic;

        await _context.SaveChangesAsync();

        return user;
    }
}
