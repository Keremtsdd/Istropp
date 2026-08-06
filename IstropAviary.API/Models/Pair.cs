using System;

namespace IstropAviary.API.Models;

public class Pair
{
    public int Id { get; set; }
    
    public int MaleId { get; set; }
    public Bird? Male { get; set; }
    
    public int FemaleId { get; set; }
    public Bird? Female { get; set; }
    
    public int NestId { get; set; }
    public Nest? Nest { get; set; }
    
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime? EndDate { get; set; }
    
    public bool IsActive { get; set; } = true;
}
