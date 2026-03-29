namespace SprintForge.Models;

public class SprintTask
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }

    public string Status { get; set; } = "Todo";
    public string Priority { get; set; } = "Medium";

    public DateTime? DueDate { get; set; }

    public Guid SprintId { get; set; }
    public Sprint Sprint { get; set; } = null!;

    public List<Artifact> Artifacts { get; set; } = new();
}