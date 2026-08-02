using System;

namespace IstropAviary.API.Models;

public class Nest
{
    public int Id { get; set; }
    public string NestCode { get; set; } = string.Empty; // e.g., N01
    public NestStatus Status { get; set; } = NestStatus.Empty;
    
    public int? AviaryId { get; set; }
    public Aviary? Aviary { get; set; }

    public string? NextAction { get; set; }
    public DateTime? NextActionDate { get; set; }
}
