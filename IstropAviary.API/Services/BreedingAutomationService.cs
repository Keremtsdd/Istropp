using System;
using System.Threading.Tasks;
using IstropAviary.API.Data;
using IstropAviary.API.Models;
using Microsoft.EntityFrameworkCore;

namespace IstropAviary.API.Services;

public class BreedingAutomationService : IBreedingAutomationService
{
    private readonly AppDbContext _context;
    private readonly ISystemSettingService _settings;

    public BreedingAutomationService(AppDbContext context, ISystemSettingService settings)
    {
        _context = context;
        _settings = settings;
    }

    public async Task PairBirdsAsync(int maleId, int femaleId, int nestId)
    {
        var pair = new Pair
        {
            MaleId = maleId,
            FemaleId = femaleId,
            NestId = nestId,
            StartDate = DateTime.UtcNow,
            IsActive = true
        };
        _context.Pairs.Add(pair);
        
        var male = await _context.Birds.FindAsync(maleId);
        var female = await _context.Birds.FindAsync(femaleId);
        if (male != null) male.Status = BirdStatus.Breeder;
        if (female != null) female.Status = BirdStatus.Breeder;
        
        var nest = await _context.Nests.FindAsync(nestId);
        if (nest != null) nest.Status = NestStatus.Active;

        await _context.SaveChangesAsync();
    }

    public async Task LogEggAsync(int pairId, DateTime laidDate)
    {
        laidDate = laidDate.Kind == DateTimeKind.Unspecified ? DateTime.SpecifyKind(laidDate, DateTimeKind.Utc) : laidDate.ToUniversalTime();
        int hatchDuration = await _settings.GetIntSettingAsync("HatchDurationDays", 21);
        int candlingDays = await _settings.GetIntSettingAsync("CandlingDays", 7);

        var hatchDate = laidDate.AddDays(hatchDuration);
        var candlingDate = laidDate.AddDays(candlingDays);

        var egg = new Egg
        {
            PairId = pairId,
            LaidDate = laidDate,
            EstimatedHatchDate = hatchDate,
            Status = EggStatus.Incubating
        };
        
        _context.Eggs.Add(egg);
        await _context.SaveChangesAsync(); // save to get Egg ID

        // Add automated tasks
        _context.SystemTasks.Add(new SystemTask
        {
            TaskType = SystemTaskType.Candling,
            Message = $"Yumurta Döl Kontrolü (Tahmini: {candlingDate:dd.MM.yyyy})",
            DueDate = candlingDate,
            RelatedEggId = egg.Id,
            RelatedPairId = pairId
        });

        _context.SystemTasks.Add(new SystemTask
        {
            TaskType = SystemTaskType.Hatching,
            Message = $"Yumurta Çıkışı Bekleniyor (Tahmini: {hatchDate:dd.MM.yyyy})",
            DueDate = hatchDate,
            RelatedEggId = egg.Id,
            RelatedPairId = pairId
        });

        await _context.SaveChangesAsync();
    }

    public async Task LogHatchAsync(int eggId, DateTime hatchDate)
    {
        hatchDate = hatchDate.Kind == DateTimeKind.Unspecified ? DateTime.SpecifyKind(hatchDate, DateTimeKind.Utc) : hatchDate.ToUniversalTime();
        var egg = await _context.Eggs.Include(e => e.Pair).FirstOrDefaultAsync(e => e.Id == eggId);
        if (egg == null) throw new Exception("Yumurta bulunamadı.");

        egg.Status = EggStatus.Hatched;

        int bandingDays = await _settings.GetIntSettingAsync("BandingDays", 10);
        int weaningDays = await _settings.GetIntSettingAsync("WeaningDays", 35);

        // Calculate next band number (Format: YYYY-NNN)
        var currentYear = DateTime.UtcNow.Year.ToString();
        var lastBandNumber = await _context.Birds
            .Where(b => b.BandNumber.StartsWith(currentYear + "-"))
            .Select(b => b.BandNumber)
            .OrderByDescending(b => b)
            .FirstOrDefaultAsync();

        int nextNumber = 1;
        if (!string.IsNullOrEmpty(lastBandNumber))
        {
            var parts = lastBandNumber.Split('-');
            if (parts.Length == 2 && int.TryParse(parts[1], out int lastNum))
            {
                nextNumber = lastNum + 1;
            }
        }
        string newBandNumber = $"{currentYear}-{nextNumber:D3}";

        // Create new Baby Bird
        var baby = new Bird
        {
            MotherId = egg.Pair?.FemaleId,
            FatherId = egg.Pair?.MaleId,
            NestId = egg.Pair?.NestId,
            BirthDate = hatchDate,
            Status = BirdStatus.Chick,
            BandNumber = newBandNumber
        };
        _context.Birds.Add(baby);
        await _context.SaveChangesAsync(); // save to get Baby ID

        // Automated Tasks
        _context.SystemTasks.Add(new SystemTask
        {
            TaskType = SystemTaskType.Banding,
            Message = $"Yavru Bilezikleme Zamanı (Kuş No: {baby.Id})",
            DueDate = hatchDate.AddDays(bandingDays),
            RelatedBirdId = baby.Id,
            RelatedPairId = egg.PairId
        });

        _context.SystemTasks.Add(new SystemTask
        {
            TaskType = SystemTaskType.Weaning,
            Message = $"Yavru Yeme Düşme/Ayırma (Kuş No: {baby.Id})",
            DueDate = hatchDate.AddDays(weaningDays),
            RelatedBirdId = baby.Id,
            RelatedPairId = egg.PairId
        });

        // Complete the hatching task if it exists
        var hatchTask = await _context.SystemTasks.FirstOrDefaultAsync(t => t.RelatedEggId == eggId && t.TaskType == SystemTaskType.Hatching);
        if (hatchTask != null)
        {
            hatchTask.IsCompleted = true;
        }

        await _context.SaveChangesAsync();
    }
}
