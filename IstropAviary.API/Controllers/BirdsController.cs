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
    private readonly IWebHostEnvironment _env;

    public BirdsController(AppDbContext context, IMapper mapper, IWebHostEnvironment env)
    {
        _context = context;
        _mapper = mapper;
        _env = env;
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
        if (await _context.Birds.AnyAsync(b => b.BandNumber == birdDto.BandNumber))
        {
            return BadRequest(new { Message = "Bu bilezik numarası sistemde zaten kayıtlı. Lütfen farklı bir numara girin." });
        }

        var bird = _mapper.Map<Bird>(birdDto);
        
        _context.Birds.Add(bird);
        await _context.SaveChangesAsync();

        // Fetch back to get related object names via AutoMapper if needed
        var createdBirdDto = _mapper.Map<BirdDto>(bird);

        return CreatedAtAction(nameof(GetBird), new { id = bird.Id }, createdBirdDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBird(int id, BirdCreateDto birdDto)
    {
        var bird = await _context.Birds.FindAsync(id);
        if (bird == null)
            return NotFound("Kuş bulunamadı.");

        if (bird.BandNumber != birdDto.BandNumber && await _context.Birds.AnyAsync(b => b.BandNumber == birdDto.BandNumber))
            return BadRequest("Bu bilezik numarası başka bir kuşa ait.");

        bird.BandNumber = birdDto.BandNumber;
        bird.Gender = birdDto.Gender;
        bird.Status = birdDto.Status;
        bird.Mutation = birdDto.Mutation;
        bird.BirthDate = birdDto.BirthDate;
        bird.FatherId = birdDto.FatherId;
        bird.MotherId = birdDto.MotherId;
        bird.AviaryId = birdDto.AviaryId;
        bird.NestId = birdDto.NestId;
        bird.RingColor = birdDto.RingColor;
        bird.EyeColor = birdDto.EyeColor;
        bird.BeakColor = birdDto.BeakColor;
        bird.HealthStatus = birdDto.HealthStatus;
        bird.FeatherCondition = birdDto.FeatherCondition;
        bird.Notes = birdDto.Notes;

        await _context.SaveChangesAsync();
        return Ok(bird);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBird(int id)
    {
        var bird = await _context.Birds.FindAsync(id);
        if (bird == null)
            return NotFound();

        // Optionally delete the image file if it exists
        if (!string.IsNullOrEmpty(bird.ImageUrl))
        {
            var filePath = Path.Combine(_env.WebRootPath, bird.ImageUrl.TrimStart('/'));
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
        }

        _context.Birds.Remove(bird);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("{id}/image")]
    public async Task<IActionResult> UploadImage(int id, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Lütfen bir resim dosyası seçin.");

        var bird = await _context.Birds.FindAsync(id);
        if (bird == null)
            return NotFound("Kuş bulunamadı.");

        // Create the directory if it doesn't exist
        var uploadsFolder = Path.Combine(_env.WebRootPath, "images", "birds");
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        // Limit size to 5MB (optional, since user approved I will add a 5MB check just in case)
        if (file.Length > 5 * 1024 * 1024)
            return BadRequest("Dosya boyutu 5 MB'dan küçük olmalıdır.");

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension))
            return BadRequest("Sadece .jpg, .jpeg, .png ve .webp formatları desteklenmektedir.");

        var uniqueFileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Delete old image if exists
        if (!string.IsNullOrEmpty(bird.ImageUrl))
        {
            var oldPath = Path.Combine(_env.WebRootPath, bird.ImageUrl.TrimStart('/'));
            if (System.IO.File.Exists(oldPath))
            {
                System.IO.File.Delete(oldPath);
            }
        }

        bird.ImageUrl = $"/images/birds/{uniqueFileName}";
        await _context.SaveChangesAsync();

        return Ok(new { ImageUrl = bird.ImageUrl });
    }
}
