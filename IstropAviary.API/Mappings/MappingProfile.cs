using AutoMapper;
using IstropAviary.API.DTOs;
using IstropAviary.API.Models;

namespace IstropAviary.API.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Bird mappings
        CreateMap<Bird, BirdDto>()
            .ForMember(dest => dest.AviaryName, opt => opt.MapFrom(src => src.Aviary != null ? src.Aviary.Name : null))
            .ForMember(dest => dest.NestCode, opt => opt.MapFrom(src => src.Nest != null ? src.Nest.NestCode : null))
            .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender.ToString()))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

        CreateMap<BirdCreateDto, Bird>();

        // Nest mappings
        CreateMap<Nest, NestDto>()
            .ForMember(dest => dest.AviaryName, opt => opt.MapFrom(src => src.Aviary != null ? src.Aviary.Name : null))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

        // Clutch mappings
        CreateMap<Clutch, ClutchDto>()
            .ForMember(dest => dest.NestCode, opt => opt.MapFrom(src => src.Nest != null ? src.Nest.NestCode : null))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));
        CreateMap<ClutchCreateDto, Clutch>();

        // Sale mappings
        CreateMap<Sale, SaleDto>();
        CreateMap<SaleDetail, SaleDetailDto>()
            .ForMember(dest => dest.BirdBandNumber, opt => opt.MapFrom(src => src.Bird != null ? src.Bird.BandNumber : null));
        CreateMap<SaleCreateDto, Sale>();
        CreateMap<SaleDetailCreateDto, SaleDetail>();

        // Transaction mappings
        CreateMap<Transaction, TransactionDto>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()));
        CreateMap<TransactionCreateDto, Transaction>();

        // CarePlan mappings
        CreateMap<CarePlan, CarePlanDto>()
            .ForMember(dest => dest.RelatedBirdBand, opt => opt.MapFrom(src => src.RelatedBird != null ? src.RelatedBird.BandNumber : null))
            .ForMember(dest => dest.RelatedNestCode, opt => opt.MapFrom(src => src.RelatedNest != null ? src.RelatedNest.NestCode : null));
        CreateMap<CarePlanCreateDto, CarePlan>();
    }
}
