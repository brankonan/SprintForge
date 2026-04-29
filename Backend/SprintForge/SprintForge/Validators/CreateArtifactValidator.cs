using FluentValidation;
using SprintForge.Dtos;

namespace SprintForge.Validators;

public class CreateArtifactValidator : AbstractValidator<CreateArtifactDto>
{
    public CreateArtifactValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(100).WithMessage("Title must be at most 100 characters.");

        RuleFor(x => x.Url)
            .NotEmpty().WithMessage("URL is required.")
            .Must(url => Uri.TryCreate(url, UriKind.Absolute, out _))
            .WithMessage("URL must be a valid absolute URL.");

        RuleFor(x => x.Type)
            .Must(t => t == "GitHub" || t == "Website" || t == "Document" || t == "Other")
            .WithMessage("Type must be GitHub, Website, Document, or Other.");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must be at most 500 characters.")
            .When(x => x.Description != null);
    }
}
