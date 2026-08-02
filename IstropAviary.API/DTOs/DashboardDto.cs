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
}
