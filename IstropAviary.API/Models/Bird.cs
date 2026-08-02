using System;

namespace IstropAviary.API.Models;

public class Bird
{
    public int Id { get; set; }
    public string BandNumber { get; set; } = string.Empty;
    public Gender Gender { get; set; } = Gender.Unknown;
    public string? Mutation { get; set; }
    public DateTime? BirthDate { get; set; }
    public BirdStatus Status { get; set; } = BirdStatus.Breeder;
    public string? Notes { get; set; }
    public string? ImageUrl { get; set; }

    // Physical Traits
    public string? RingColor { get; set; }
    public string? BeakColor { get; set; }
    public string? EyeColor { get; set; }
    public string? FeatherCondition { get; set; }
    public string? HealthStatus { get; set; }

    // Relationships
    public int? MotherId { get; set; }
    public Bird? Mother { get; set; }

    public int? FatherId { get; set; }
    public Bird? Father { get; set; }

    public int? NestId { get; set; }
    public Nest? Nest { get; set; }

    public int? AviaryId { get; set; }
    public Aviary? Aviary { get; set; }
}
