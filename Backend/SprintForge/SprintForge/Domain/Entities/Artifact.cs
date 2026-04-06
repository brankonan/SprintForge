namespace SprintForge.Domain.Entities;

public class Artifact
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = "Other";

    public string Url { get; set; } = string.Empty;
    public string? Description { get; set; }

    public Guid SprintTaskId { get; set; }
    public SprintTask SprintTask { get; set; } = null!;
}
