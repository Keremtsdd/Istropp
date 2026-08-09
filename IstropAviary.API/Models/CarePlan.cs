using System;

namespace IstropAviary.API.Models;

public class CarePlan
{
    public int Id { get; set; }
    public int DayNumber { get; set; } // 1 to 14
    public string Name { get; set; } = string.Empty;
    public string? Purpose { get; set; }
    public string? WaterDosage { get; set; }
    public string? FoodDosage { get; set; }
}
