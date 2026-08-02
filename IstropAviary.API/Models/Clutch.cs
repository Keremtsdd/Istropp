using System;

namespace IstropAviary.API.Models;

public class Clutch
{
    public int Id { get; set; }
    public int NestId { get; set; }
    public Nest? Nest { get; set; }

    public DateTime? LaidDate { get; set; }
    public DateTime? HatchDate { get; set; }
    public DateTime? BandingDate { get; set; }
    public EggStatus Status { get; set; } = EggStatus.Egg;
}
