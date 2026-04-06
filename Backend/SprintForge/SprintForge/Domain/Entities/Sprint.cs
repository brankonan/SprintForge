namespace SprintForge.Domain.Entities;

public class Sprint
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Goal { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public string Status { get; set; } = "Planned";

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public List<SprintTask> Tasks { get; set; } = new();
}
