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
public class NestsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public NestsController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NestDto>>> GetNests()
    {
        var nests = await _context.Nests
            .AsNoTracking()
            .Include(n => n.Aviary)
            .ToListAsync();

        return Ok(_mapper.Map<IEnumerable<NestDto>>(nests));
    }

    [HttpPost]
    public async Task<ActionResult<NestDto>> CreateNest(Nest nest)
    {
        _context.Nests.Add(nest);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetNests), new { id = nest.Id }, _mapper.Map<NestDto>(nest));
    }
}
