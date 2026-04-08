namespace SprintForge.Dtos;

public class PublicPortfolioDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public List<PortfolioSprintDto> Sprints { get; set; } = new();
}

public class PortfolioSprintDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Goal { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int TaskCount { get; set; }
    public int DoneCount { get; set; }
}
