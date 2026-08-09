using System.Threading.Tasks;
using System.Linq;
using IstropAviary.API.DTOs;
using IstropAviary.API.Data;
using IstropAviary.API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IstropAviary.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class BreedingController : ControllerBase
{
    private readonly IBreedingAutomationService _breedingService;

    public BreedingController(IBreedingAutomationService breedingService)
    {
        _breedingService = breedingService;
    }

    [HttpGet("pairs")]
    public async Task<IActionResult> GetPairs([FromServices] AppDbContext context)
    {
        var pairs = await context.Pairs
            .Include(p => p.Male)
            .Include(p => p.Female)
            .Where(p => p.IsActive)
            .ToListAsync();
        return Ok(pairs);
    }

    [HttpGet("eggs")]
    public async Task<IActionResult> GetEggs([FromServices] AppDbContext context)
    {
        var eggs = await context.Eggs.ToListAsync();
        return Ok(eggs);
    }

    [HttpPost("pair")]
    public async Task<IActionResult> PairBirds([FromBody] PairBirdsRequest request)
    {
        await _breedingService.PairBirdsAsync(request.MaleId, request.FemaleId, request.NestId);
        return Ok(new { message = "Kuşlar başarıyla eşleştirildi ve üretim programı başlatıldı." });
    }

    [HttpPost("egg")]
    public async Task<IActionResult> LogEgg([FromBody] LogEggRequest request)
    {
        await _breedingService.LogEggAsync(request.PairId, request.LaidDate);
        return Ok(new { message = "Yumurta başarıyla eklendi ve kontrol/çıkış görevleri planlandı." });
    }

    [HttpPost("hatch")]
    public async Task<IActionResult> LogHatch([FromBody] LogHatchRequest request)
    {
        await _breedingService.LogHatchAsync(request.EggId, request.HatchDate);
        return Ok(new { message = "Yavru çıkışı kaydedildi, bilezikleme ve yeme düşme görevleri planlandı." });
    }

    [HttpDelete("egg/{id}")]
    public async Task<IActionResult> DeleteEgg(int id, [FromServices] AppDbContext context)
    {
        var egg = await context.Eggs.FindAsync(id);
        if (egg == null) return NotFound(new { message = "Yumurta bulunamadı." });

        context.Eggs.Remove(egg);
        await context.SaveChangesAsync();
        return Ok(new { message = "Yumurta başarıyla silindi." });
    }
}
