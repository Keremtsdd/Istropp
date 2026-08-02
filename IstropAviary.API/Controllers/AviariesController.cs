using IstropAviary.API.Data;
using IstropAviary.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IstropAviary.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AviariesController : ControllerBase
{
    private readonly AppDbContext _context;

    public AviariesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Aviary>>> GetAviaries()
    {
        // Simple entity return since it has no sensitive nested relations
        return await _context.Aviaries.AsNoTracking().ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Aviary>> CreateAviary(Aviary aviary)
    {
        _context.Aviaries.Add(aviary);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAviaries), new { id = aviary.Id }, aviary);
    }
}
