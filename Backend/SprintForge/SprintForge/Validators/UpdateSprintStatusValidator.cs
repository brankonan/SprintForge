using FluentValidation;
using SprintForge.Dtos;

namespace SprintForge.Validators;

public class UpdateSprintStatusValidator : AbstractValidator<UpdateSprintStatusDto>
{
    public UpdateSprintStatusValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required.")
            .Must(s => s == "Planned" || s == "Active" || s == "Completed")
            .WithMessage("Status must be Planned, Active, or Completed.");
    }
}
