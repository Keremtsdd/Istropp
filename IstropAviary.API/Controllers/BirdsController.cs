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
public class BirdsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public BirdsController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BirdDto>>> GetBirds()
    {
        // AsNoTracking for fast read performance
        var birds = await _context.Birds
            .AsNoTracking()
            .Include(b => b.Aviary)
            .Include(b => b.Nest)
            .ToListAsync();

        return Ok(_mapper.Map<IEnumerable<BirdDto>>(birds));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BirdDto>> GetBird(int id)
    {
        var bird = await _context.Birds
            .AsNoTracking()
            .Include(b => b.Aviary)
            .Include(b => b.Nest)
            .Include(b => b.Mother)
            .Include(b => b.Father)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (bird == null)
            return NotFound();

        return Ok(_mapper.Map<BirdDto>(bird));
    }

    [HttpPost]
    public async Task<ActionResult<BirdDto>> CreateBird(BirdCreateDto birdDto)
    {
        var bird = _mapper.Map<Bird>(birdDto);
        
        _context.Birds.Add(bird);
        await _context.SaveChangesAsync();

        // Fetch back to get related object names via AutoMapper if needed
        var createdBirdDto = _mapper.Map<BirdDto>(bird);

        return CreatedAtAction(nameof(GetBird), new { id = bird.Id }, createdBirdDto);
    }
}
