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
public class ClutchesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public ClutchesController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClutchDto>>> GetClutches()
    {
        var clutches = await _context.Clutches
            .AsNoTracking()
            .Include(c => c.Nest)
            .ToListAsync();

        return Ok(_mapper.Map<IEnumerable<ClutchDto>>(clutches));
    }

    [HttpPost]
    public async Task<ActionResult<ClutchDto>> CreateClutch(ClutchCreateDto dto)
    {
        var clutch = _mapper.Map<Clutch>(dto);
        _context.Clutches.Add(clutch);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetClutches), new { id = clutch.Id }, _mapper.Map<ClutchDto>(clutch));
    }
}
