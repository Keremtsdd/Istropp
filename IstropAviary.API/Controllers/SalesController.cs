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
            .ToListAsync();

        return Ok(_mapper.Map<IEnumerable<SaleDto>>(sales));
    }

    [HttpPost]
    public async Task<ActionResult<SaleDto>> CreateSale(SaleCreateDto dto)
    {
        var sale = _mapper.Map<Sale>(dto);
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

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSales), new { id = sale.Id }, _mapper.Map<SaleDto>(sale));
    }
}
