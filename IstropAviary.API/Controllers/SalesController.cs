using AutoMapper;
using IstropAviary.API.Data;
using IstropAviary.API.DTOs;
using IstropAviary.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IstropAviary.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SalesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public SalesController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SaleDto>>> GetSales()
    {
        var sales = await _context.Sales
            .AsNoTracking()
            .Include(s => s.SaleDetails)
            .ThenInclude(sd => sd.Bird)
            .OrderByDescending(s => s.Date)
            .ToListAsync();

        return Ok(_mapper.Map<IEnumerable<SaleDto>>(sales));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SaleDto>> GetSale(int id)
    {
        var sale = await _context.Sales
            .AsNoTracking()
            .Include(s => s.SaleDetails)
            .ThenInclude(sd => sd.Bird)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sale == null)
            return NotFound();

        return Ok(_mapper.Map<SaleDto>(sale));
    }

    [HttpPost]
    public async Task<ActionResult<SaleDto>> CreateSale(SaleCreateDto dto)
    {
        var sale = _mapper.Map<Sale>(dto);
        
        // Postgres requires UTC for timestamp with time zone
        sale.Date = DateTime.SpecifyKind(sale.Date, DateTimeKind.Utc);
        
        // Auto-generate SaleNumber if empty
        if (string.IsNullOrWhiteSpace(sale.SaleNumber))
        {
            sale.SaleNumber = $"SAT-{DateTime.Now.Year}-{new Random().Next(1000, 9999)}";
        }
        
        _context.Sales.Add(sale);
        
        // Update bird statuses to 'Sold'
        foreach(var detail in sale.SaleDetails)
        {
            var bird = await _context.Birds.FindAsync(detail.BirdId);
            if (bird != null)
            {
                bird.Status = BirdStatus.Sold;
            }
        }

        // Create Income Transaction
        var transaction = new Transaction
        {
            Date = sale.Date,
            Description = $"Satış Geliri: {sale.SaleNumber}",
            Type = TransactionType.Income,
            Category = "Satış",
            Amount = sale.TotalAmount
        };
        _context.Transactions.Add(transaction);

        await _context.SaveChangesAsync();

        // Reload to include bird details for DTO
        await _context.Entry(sale).Collection(s => s.SaleDetails).Query().Include(sd => sd.Bird).LoadAsync();

        return CreatedAtAction(nameof(GetSale), new { id = sale.Id }, _mapper.Map<SaleDto>(sale));
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateSale(int id, SaleCreateDto dto)
    {
        var sale = await _context.Sales
            .Include(s => s.SaleDetails)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sale == null)
            return NotFound();

        // Revert old birds to Available
        foreach (var oldDetail in sale.SaleDetails)
        {
            var oldBird = await _context.Birds.FindAsync(oldDetail.BirdId);
            if (oldBird != null) oldBird.Status = BirdStatus.Breeder;
        }

        // Update fields
        sale.Date = DateTime.SpecifyKind(dto.Date, DateTimeKind.Utc);
        sale.CustomerName = dto.CustomerName;
        sale.CustomerPhone = dto.CustomerPhone;
        sale.CustomerCity = dto.CustomerCity;
        sale.PaymentType = dto.PaymentType;
        sale.TotalAmount = dto.TotalAmount;
        sale.Notes = dto.Notes;

        // Re-map details
        _context.SaleDetails.RemoveRange(sale.SaleDetails);
        sale.SaleDetails = _mapper.Map<List<SaleDetail>>(dto.SaleDetails);

        // Update new birds to Sold
        foreach(var detail in sale.SaleDetails)
        {
            var bird = await _context.Birds.FindAsync(detail.BirdId);
            if (bird != null) bird.Status = BirdStatus.Sold;
        }

        // Sync Transaction
        var transaction = await _context.Transactions
            .FirstOrDefaultAsync(t => t.Description == $"Satış Geliri: {sale.SaleNumber}");
        
        if (transaction != null)
        {
            transaction.Date = sale.Date;
            transaction.Amount = sale.TotalAmount;
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }
    
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteSale(int id)
    {
        var sale = await _context.Sales
            .Include(s => s.SaleDetails)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sale == null)
            return NotFound();

        // Revert birds to Available
        foreach (var detail in sale.SaleDetails)
        {
            var bird = await _context.Birds.FindAsync(detail.BirdId);
            if (bird != null) bird.Status = BirdStatus.Breeder;
        }

        // Delete associated Transaction
        var transaction = await _context.Transactions
            .FirstOrDefaultAsync(t => t.Description == $"Satış Geliri: {sale.SaleNumber}");
        
        if (transaction != null)
        {
            _context.Transactions.Remove(transaction);
        }

        _context.Sales.Remove(sale);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
