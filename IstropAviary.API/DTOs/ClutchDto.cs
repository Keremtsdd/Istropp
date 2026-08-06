using IstropAviary.API.Models;
using System;

namespace IstropAviary.API.DTOs;

public class ClutchDto
{
    public int Id { get; set; }
    public int NestId { get; set; }
    public string? NestCode { get; set; }

    public int IncubatingEggCount { get; set; }
    public int HatchedCount { get; set; }
    public int LostCount { get; set; }

    public DateTime? LaidDate { get; set; }
    public DateTime? HatchDate { get; set; }
    public DateTime? BandingDate { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class ClutchCreateDto
{
    public int NestId { get; set; }
    public DateTime? LaidDate { get; set; }
    public DateTime? HatchDate { get; set; }
    public DateTime? BandingDate { get; set; }
    public EggStatus Status { get; set; } = EggStatus.Incubating;
}
