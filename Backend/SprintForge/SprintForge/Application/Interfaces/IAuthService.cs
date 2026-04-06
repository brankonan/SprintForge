using SprintForge.Dtos;

namespace SprintForge.Application.Interfaces;

public interface IAuthService
{
    Task<string> Register(RegisterDto dto);
    Task<LoginResponseDto> Login(LoginDto dto);
}
