using System;
using System.Collections.Generic;
using IstropAviary.API.DTOs;

namespace IstropAviary.API.DTOs;

public class DashboardDto
{
    public int TotalBirds { get; set; }
    public int ActiveNests { get; set; }
    public decimal MonthlySales { get; set; }
    public decimal NetProfit { get; set; }
    public List<CarePlanDto> UpcomingCarePlans { get; set; } = new List<CarePlanDto>();
    public List<DashboardAlertDto> TodayTasks { get; set; } = new List<DashboardAlertDto>();
}

public class DashboardAlertDto
{
    public string Type { get; set; } = string.Empty; // "Hatch", "Care", "Stock"
    public string Message { get; set; } = string.Empty;
    public string Severity { get; set; } = "Info"; // "Critical", "Warning", "Info"
    public DateTime Date { get; set; }
}
