namespace SprintForge.Dtos;

public class UpdateSprintTaskDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Priority { get; set; } = "Medium";
}
