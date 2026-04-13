using System.ComponentModel.DataAnnotations;

namespace SprintForge.Dtos
{
    public class UpdateSprintStatusDto
    {
        [Required]
        [RegularExpression("^(Planned|Active|Completed)$", ErrorMessage = "Status must be Planned, Active, or Completed")]
        public string Status { get; set; } = string.Empty;
    }
}
