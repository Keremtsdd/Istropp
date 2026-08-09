using AutoMapper;
using IstropAviary.API.Data;
using IstropAviary.API.DTOs;
using IstropAviary.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace IstropAviary.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public DashboardController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<DashboardDto>> GetDashboardStats()
    {
        var totalBirds = await _context.Birds.CountAsync(b => b.Status != BirdStatus.Deceased && b.Status != BirdStatus.Sold);
        var activeNests = await _context.Nests.CountAsync(n => n.Status == NestStatus.Active);
        
        var firstDayOfMonth = DateTime.SpecifyKind(new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1), DateTimeKind.Utc);
        
        var monthlySales = await _context.Sales
            .Where(s => s.Date >= firstDayOfMonth)
            .SumAsync(s => s.TotalAmount);

        // Approximate net profit logic for transactions
        var monthlyIncome = await _context.Transactions
            .Where(t => t.Date >= firstDayOfMonth && t.Type == TransactionType.Income)
            .SumAsync(t => t.Amount);
            
        var monthlyExpense = await _context.Transactions
            .Where(t => t.Date >= firstDayOfMonth && t.Type == TransactionType.Expense)
            .SumAsync(t => t.Amount);
            
        var today = DateTime.UtcNow.Date;

        var upcomingHatches = await _context.Clutches
            .Include(c => c.Nest)
            .Where(c => c.Status == EggStatus.Incubating && c.HatchDate.HasValue && c.HatchDate.Value.Date >= today && c.HatchDate.Value.Date <= today.AddDays(2))
            .ToListAsync();

        var alerts = new List<DashboardAlertDto>();

        foreach(var hatch in upcomingHatches)
        {
            var daysLeft = (hatch.HatchDate!.Value.Date - today).Days;
            alerts.Add(new DashboardAlertDto {
                Type = "Hatch",
                Message = daysLeft == 0 ? $"{hatch.Nest?.NestCode} nolu yuvada kuluçka çıkımı bugün!" : $"{hatch.Nest?.NestCode} nolu yuvada kuluçka çıkımına {daysLeft} gün kaldı.",
                Severity = daysLeft == 0 ? "Critical" : "Warning",
                Date = hatch.HatchDate.Value
            });
        }

        return Ok(new DashboardDto
        {
            TotalBirds = totalBirds,
            ActiveNests = activeNests,
            MonthlySales = monthlySales,
            NetProfit = monthlyIncome - monthlyExpense,
            UpcomingCarePlans = new List<CarePlanDto>(), // Care plans are now template based
            TodayTasks = alerts.OrderBy(a => a.Date).ToList()
        });
    }
}
