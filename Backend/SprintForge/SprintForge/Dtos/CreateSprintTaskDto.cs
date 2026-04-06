using System.ComponentModel.DataAnnotations;

namespace SprintForge.Dtos
{
    public class CreateSprintTaskDto
    {
        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [RegularExpression("^(High|Medium|Low)$", ErrorMessage = "Priority must be High, Medium, or Low")]
        public string Priority { get; set; } = "Medium";

        public DateTime? DueDate { get; set; }
    }
}
