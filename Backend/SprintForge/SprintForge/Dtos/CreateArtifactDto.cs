using System.ComponentModel.DataAnnotations;

namespace SprintForge.Dtos;

public class CreateArtifactDto
{
    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [Url]
    public string Url { get; set; } = string.Empty;

    [RegularExpression("^(GitHub|Website|Document|Other)$", ErrorMessage = "Type must be GitHub, Website, Document, or Other")]
    public string Type { get; set; } = "Other";

    [MaxLength(500)]
    public string? Description { get; set; }
}
