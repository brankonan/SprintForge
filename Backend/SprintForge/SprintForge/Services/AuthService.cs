using SprintForge.Data;
using SprintForge.Models;
using SprintForge.Dtos;

namespace SprintForge.Services;

public class AuthService
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwtService;

    public AuthService(AppDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<string> Register(RegisterDto dto)
    {
        var existingUser = _context.Users.FirstOrDefault(x => x.Email == dto.Email);

        if (existingUser != null)
            throw new Exception("User already exists");

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            PasswordHash = passwordHash,
            Role = "Student"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return "User created";
    }

    public async Task<LoginResponseDto> Login(LoginDto dto)
    {
        var user = _context.Users.FirstOrDefault(x => x.Email == dto.Email);

        if (user == null)
            throw new Exception("User not found");

        var valid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

        if (!valid)
            throw new Exception("Wrong password");

        var token = _jwtService.GenerateToken(user);

        return new LoginResponseDto
        {
            Token = token,
            Email = user.Email,
            FirstName = user.FirstName,
            Role = user.Role
        };
    }
}