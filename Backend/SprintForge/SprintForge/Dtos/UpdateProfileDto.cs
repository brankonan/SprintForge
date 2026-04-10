using System.ComponentModel.DataAnnotations;

namespace SprintForge.Dtos;

public class UpdateProfileDto
{
    [MaxLength(500)]
    public string? Bio { get; set; }

    public bool IsPortfolioPublic { get; set; }
}
