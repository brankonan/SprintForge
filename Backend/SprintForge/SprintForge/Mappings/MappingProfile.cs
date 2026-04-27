using AutoMapper;
using SprintForge.Domain.Entities;
using SprintForge.Dtos;

namespace SprintForge.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Sprint, SprintResponseDto>();
        CreateMap<SprintTask, SprintTaskResponseDto>();
        CreateMap<Artifact, ArtifactResponseDto>();
    }
}
