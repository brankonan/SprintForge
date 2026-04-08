using Microsoft.AspNetCore.Mvc;
using SprintForge.Application.Interfaces;

namespace SprintForge.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("explore")]
    public async Task<IActionResult> Explore([FromQuery] string? search, [FromQuery] int limit = 20)
    {
        var users = await _userService.GetPublicUsers(search, limit);
        return Ok(users);
    }

    [HttpGet("{id}/portfolio")]
    public async Task<IActionResult> GetPortfolio(Guid id)
    {
        var portfolio = await _userService.GetPublicPortfolio(id);

        if (portfolio == null)
            return NotFound(new { message = "Portfolio is private or user not found." });

        return Ok(portfolio);
    }
}
