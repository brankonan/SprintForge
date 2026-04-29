namespace SprintForge.Dtos;

public class CreateArtifactDto
{
    public string Title { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Type { get; set; } = "Other";
    public string? Description { get; set; }
}
