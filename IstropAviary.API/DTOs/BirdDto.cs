using IstropAviary.API.Models;
using System;

namespace IstropAviary.API.DTOs;

public class BirdDto
{
    public int Id { get; set; }
    public string BandNumber { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string? Mutation { get; set; }
    public DateTime? BirthDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? Notes { get; set; }

    // Physical Traits
    public string? RingColor { get; set; }
    public string? BeakColor { get; set; }
    public string? EyeColor { get; set; }
    public string? FeatherCondition { get; set; }
    public string? HealthStatus { get; set; }

    public int? AviaryId { get; set; }
    public string? AviaryName { get; set; }

    public int? NestId { get; set; }
    public string? NestCode { get; set; }

    // Soy Ağacı (Pedigree)
    public int? MotherId { get; set; }
    public string? MotherBandNumber { get; set; }
    
    public int? FatherId { get; set; }
    public string? FatherBandNumber { get; set; }
}

public class BirdCreateDto
{
    public string BandNumber { get; set; } = string.Empty;
    public Gender Gender { get; set; } = Gender.Unknown;
    public string? Mutation { get; set; }
    public DateTime? BirthDate { get; set; }
    public BirdStatus Status { get; set; } = BirdStatus.Breeder;
    public string? Notes { get; set; }
    
    // Physical Traits
    public string? RingColor { get; set; }
    public string? BeakColor { get; set; }
    public string? EyeColor { get; set; }
    public string? FeatherCondition { get; set; }
    public string? HealthStatus { get; set; }
    
    public int? AviaryId { get; set; }
    public int? NestId { get; set; }
    public int? MotherId { get; set; }
    public int? FatherId { get; set; }
}
