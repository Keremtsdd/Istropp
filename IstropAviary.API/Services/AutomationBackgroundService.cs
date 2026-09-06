using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using IstropAviary.API.Data;
using IstropAviary.API.Models;

namespace IstropAviary.API.Services;

public class AutomationBackgroundService : BackgroundService
{
    private readonly ILogger<AutomationBackgroundService> _logger;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly TimeSpan _checkInterval = TimeSpan.FromHours(1);

    public AutomationBackgroundService(ILogger<AutomationBackgroundService> logger, IServiceScopeFactory scopeFactory)
    {
        _logger = logger;
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Automation Background Service is starting.");

        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("Automation Background Service is running...");
            
            try
            {
                await RunAutomationChecksAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred executing automation checks.");
            }

            await Task.Delay(_checkInterval, stoppingToken);
        }
        
        _logger.LogInformation("Automation Background Service is stopping.");
    }

    private async Task RunAutomationChecksAsync()
    {
        using var scope = _scopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Get system settings
        var settingsDict = await dbContext.SystemSettings.ToDictionaryAsync(s => s.Key, s => s.Value);

        // Parse automation days (fallbacks if not exist)
        int hatchDays = int.TryParse(settingsDict.GetValueOrDefault("HatchDurationDays", "21"), out var hd) ? hd : 21;
        int candlingDays = int.TryParse(settingsDict.GetValueOrDefault("CandlingDays", "7"), out var cd) ? cd : 7;
        int bandingDays = int.TryParse(settingsDict.GetValueOrDefault("BandingDays", "10"), out var bd) ? bd : 10;
        int weaningDays = int.TryParse(settingsDict.GetValueOrDefault("WeaningDays", "35"), out var wd) ? wd : 35;

        // Parse notification booleans
        bool notifEggCheck = settingsDict.GetValueOrDefault("NotifEggCheck", "true") == "true";
        bool notifHatch = settingsDict.GetValueOrDefault("NotifHatch", "true") == "true";
        bool notifBanding = settingsDict.GetValueOrDefault("NotifBanding", "true") == "true";
        bool notifWeaning = settingsDict.GetValueOrDefault("NotifWeaning", "true") == "true";

        var today = DateTime.UtcNow.Date;

        // Fetch active eggs
        var eggs = await dbContext.Eggs.Where(e => e.Status == EggStatus.Incubating || e.Status == EggStatus.Fertile).ToListAsync();
        
        foreach (var egg in eggs)
        {
            var laidDate = egg.LaidDate.Date;
            var daysSinceLaid = (today - laidDate).Days;
            
            // 1. Candling (Döl Kontrolü)
            if (notifEggCheck && daysSinceLaid >= candlingDays && egg.Status == EggStatus.Incubating)
            {
                await CreateTaskIfNotExistsAsync(dbContext, SystemTaskType.Candling, $"Yumurta döl kontrol zamanı (Yumurta ID: {egg.Id})", egg.Id, null);
            }
            
            // 2. Hatching (Kuluçka Çıkışı)
            if (notifHatch && daysSinceLaid >= (hatchDays - 2) && (egg.Status == EggStatus.Incubating || egg.Status == EggStatus.Fertile))
            {
                await CreateTaskIfNotExistsAsync(dbContext, SystemTaskType.Hatching, $"Yumurta çıkış zamanı yaklaştı (Yumurta ID: {egg.Id})", egg.Id, null);
            }
        }

        // Fetch active nests with chicks (for banding and weaning) - approximation using eggs that hatched recently
        var hatchedEggs = await dbContext.Eggs.Where(e => e.Status == EggStatus.Hatched).ToListAsync();
        foreach (var egg in hatchedEggs)
        {
            var hatchDate = egg.LaidDate.Date.AddDays(hatchDays);
            var daysSinceHatch = (today - hatchDate).Days;

            // 3. Banding (Bilezikleme)
            if (notifBanding && daysSinceHatch >= bandingDays && daysSinceHatch <= bandingDays + 5)
            {
                await CreateTaskIfNotExistsAsync(dbContext, SystemTaskType.Banding, $"Yavru bilezikleme zamanı (İlişkili Yumurta ID: {egg.Id})", egg.Id, null);
            }

            // 4. Weaning (Yeme Düşme)
            if (notifWeaning && daysSinceHatch >= weaningDays && daysSinceHatch <= weaningDays + 10)
            {
                await CreateTaskIfNotExistsAsync(dbContext, SystemTaskType.Weaning, $"Yavru yeme düşme (ayırma) zamanı (İlişkili Yumurta ID: {egg.Id})", egg.Id, null);
            }
        }

        await dbContext.SaveChangesAsync();
    }

    private async Task CreateTaskIfNotExistsAsync(AppDbContext dbContext, SystemTaskType type, string message, int? eggId, int? pairId)
    {
        bool exists = await dbContext.SystemTasks.AnyAsync(t => 
            t.TaskType == type && 
            t.RelatedEggId == eggId && 
            t.RelatedPairId == pairId &&
            !t.IsCompleted);

        if (!exists)
        {
            dbContext.SystemTasks.Add(new SystemTask
            {
                TaskType = type,
                Message = message,
                DueDate = DateTime.UtcNow.Date,
                IsCompleted = false,
                RelatedEggId = eggId,
                RelatedPairId = pairId
            });
            
            _logger.LogInformation($"Created new SystemTask: {message}");
        }
    }
}
