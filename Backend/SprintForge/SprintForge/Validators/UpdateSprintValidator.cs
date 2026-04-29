using FluentValidation;
using SprintForge.Dtos;

namespace SprintForge.Validators;

public class UpdateSprintValidator : AbstractValidator<UpdateSprintDto>
{
    public UpdateSprintValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(100).WithMessage("Title must be at most 100 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must be at most 500 characters.")
            .When(x => x.Description != null);

        RuleFor(x => x.Goal)
            .MaximumLength(200).WithMessage("Goal must be at most 200 characters.")
            .When(x => x.Goal != null);

        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage("Start date is required.");

        RuleFor(x => x.EndDate)
            .NotEmpty().WithMessage("End date is required.")
            .GreaterThan(x => x.StartDate).WithMessage("End date must be after start date.");
    }
}
