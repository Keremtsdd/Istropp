using System;

namespace IstropAviary.API.DTOs
{
    public class CarePlanDto
    {
        public int Id { get; set; }
        public int DayNumber { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Purpose { get; set; }
        public string? WaterDosage { get; set; }
        public string? FoodDosage { get; set; }
    }

    public class CarePlanCreateDto
    {
        public int DayNumber { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Purpose { get; set; }
        public string? WaterDosage { get; set; }
        public string? FoodDosage { get; set; }
    }
}
