using FluentValidation;
using SprintForge.Dtos;

namespace SprintForge.Validators;

public class CreateSprintTaskValidator : AbstractValidator<CreateSprintTaskDto>
{
    public CreateSprintTaskValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(100).WithMessage("Title must be at most 100 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must be at most 500 characters.")
            .When(x => x.Description != null);

        RuleFor(x => x.Priority)
            .NotEmpty().WithMessage("Priority is required.")
            .Must(p => p == "High" || p == "Medium" || p == "Low")
            .WithMessage("Priority must be High, Medium, or Low.");
    }
}
