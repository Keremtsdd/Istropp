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

        var systemTasks = await _context.SystemTasks
            .Where(t => !t.IsCompleted)
            .OrderBy(t => t.DueDate)
            .ToListAsync();

        var alerts = systemTasks.Select(t => new DashboardAlertDto
        {
            Id = t.Id,
            Type = t.TaskType.ToString(),
            Message = t.Message,
            Severity = t.DueDate.Date < today ? "Critical" : (t.DueDate.Date == today ? "Warning" : "Info"),
            Date = t.DueDate
        }).ToList();

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
