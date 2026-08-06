using System;

namespace IstropAviary.API.Models;

public class Egg
{
    public int Id { get; set; }
    
    public int PairId { get; set; }
    public Pair? Pair { get; set; }
    
    public DateTime LaidDate { get; set; } = DateTime.UtcNow;
    public DateTime? EstimatedHatchDate { get; set; }
    
    public EggStatus Status { get; set; } = EggStatus.Incubating;
    
    public string? Notes { get; set; }
}
