using System.ComponentModel.DataAnnotations;

namespace SprintForge.Dtos
{
    public class UpdateTaskStatusDto
    {
        [Required]
        [RegularExpression("^(Todo|InProgress|Done)$", ErrorMessage = "Status must be Todo, InProgress, or Done")]
        public string Status { get; set; } = string.Empty;
    }
}
