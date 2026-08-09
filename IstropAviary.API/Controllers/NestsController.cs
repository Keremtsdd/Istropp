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
    public async Task<ActionResult<NestDto>> CreateNest(NestCreateDto dto)
    {
        var nest = new Nest
        {
            NestCode = dto.NestCode,
            Status = dto.Status,
            AviaryId = dto.AviaryId
        };
        _context.Nests.Add(nest);
        await _context.SaveChangesAsync();

        var createdNest = await _context.Nests
            .Include(n => n.Aviary)
            .FirstOrDefaultAsync(n => n.Id == nest.Id);

        return CreatedAtAction(nameof(GetNests), new { id = nest.Id }, _mapper.Map<NestDto>(createdNest));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<NestDto>> UpdateNest(int id, NestCreateDto dto)
    {
        var nest = await _context.Nests.FindAsync(id);
        if (nest == null) return NotFound();

        nest.NestCode = dto.NestCode;
        nest.Status = dto.Status;
        nest.AviaryId = dto.AviaryId;

        await _context.SaveChangesAsync();

        var updatedNest = await _context.Nests
            .Include(n => n.Aviary)
            .FirstOrDefaultAsync(n => n.Id == id);

        return Ok(_mapper.Map<NestDto>(updatedNest));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNest(int id)
    {
        var nest = await _context.Nests.FindAsync(id);
        if (nest == null) return NotFound();

        _context.Nests.Remove(nest);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
