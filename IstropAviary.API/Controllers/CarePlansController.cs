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
public class CarePlansController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public CarePlansController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CarePlanDto>>> GetCarePlans()
    {
        var plans = await _context.CarePlans
            .AsNoTracking()
            .ToListAsync();

        return Ok(_mapper.Map<IEnumerable<CarePlanDto>>(plans));
    }

    [HttpPost]
    public async Task<ActionResult<CarePlanDto>> CreateCarePlan(CarePlanCreateDto dto)
    {
        var plan = _mapper.Map<CarePlan>(dto);
        _context.CarePlans.Add(plan);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCarePlans), new { id = plan.Id }, _mapper.Map<CarePlanDto>(plan));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCarePlan(int id, CarePlanCreateDto dto)
    {
        var plan = await _context.CarePlans.FindAsync(id);
        if (plan == null) return NotFound();

        _mapper.Map(dto, plan);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCarePlan(int id)
    {
        var plan = await _context.CarePlans.FindAsync(id);
        if (plan == null) return NotFound();

        _context.CarePlans.Remove(plan);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
