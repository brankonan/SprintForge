using FluentValidation;
using SprintForge.Dtos;

namespace SprintForge.Validators;

public class UpdateTaskStatusValidator : AbstractValidator<UpdateTaskStatusDto>
{
    public UpdateTaskStatusValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required.")
            .Must(s => s == "Todo" || s == "InProgress" || s == "Done")
            .WithMessage("Status must be Todo, InProgress, or Done.");
    }
}
