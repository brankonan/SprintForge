namespace SprintForge.Dtos;

public class SprintTaskResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public Guid SprintId { get; set; }
    public List<ArtifactResponseDto> Artifacts { get; set; } = new();
}
