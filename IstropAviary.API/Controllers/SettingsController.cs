using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using IstropAviary.API.Models;
using IstropAviary.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IstropAviary.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly ISystemSettingService _settingService;
    private readonly IWebHostEnvironment _env;
    private readonly IImageService _imageService;

    public SettingsController(ISystemSettingService settingService, IWebHostEnvironment env, IImageService imageService)
    {
        _settingService = settingService;
        _env = env;
        _imageService = imageService;
    }

    [HttpGet]
    public async Task<ActionResult<Dictionary<string, string>>> GetAllSettings()
    {
        var settings = await _settingService.GetAllSettingsAsync();
        return Ok(settings);
    }

    [HttpPost]
    public async Task<IActionResult> UpdateSettings([FromBody] Dictionary<string, string> settings)
    {
        foreach (var kvp in settings)
        {
            await _settingService.SetSettingAsync(kvp.Key, kvp.Value);
        }
        return Ok(new { message = "Ayarlar başarıyla güncellendi." });
    }

    [HttpPost("logo")]
    public async Task<IActionResult> UploadLogo(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Lütfen bir resim dosyası seçin.");

        if (file.Length > 5 * 1024 * 1024)
            return BadRequest("Dosya boyutu 5 MB'dan küçük olmalıdır.");

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".svg" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension))
            return BadRequest("Sadece resim formatları desteklenmektedir.");

        try
        {
            var newLogoUrl = await _imageService.UploadImageAsync(file, "settings");
            if (string.IsNullOrEmpty(newLogoUrl))
            {
                return BadRequest("Resim yüklenemedi.");
            }

            await _settingService.SetSettingAsync("CompanyLogo", newLogoUrl);
            return Ok(new { ImageUrl = newLogoUrl });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Yükleme hatası: {ex.Message}");
        }
    }
}
