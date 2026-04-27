namespace SprintForge.Dtos;

public class ArtifactResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid SprintTaskId { get; set; }
}
