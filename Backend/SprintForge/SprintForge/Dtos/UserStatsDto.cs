namespace SprintForge.Dtos;

public class UserStatsDto
{
    public int TotalSprints { get; set; }
    public int ActiveSprints { get; set; }
    public int CompletedSprints { get; set; }
    public int PlannedSprints { get; set; }
    public int TotalTasks { get; set; }
    public int DoneTasks { get; set; }
    public int CompletionRate { get; set; }
}
