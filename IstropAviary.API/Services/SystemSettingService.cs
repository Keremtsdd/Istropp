using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IstropAviary.API.Data;
using IstropAviary.API.Models;
using Microsoft.EntityFrameworkCore;

namespace IstropAviary.API.Services;

public class SystemSettingService : ISystemSettingService
{
    private readonly AppDbContext _context;

    public SystemSettingService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<string> GetSettingAsync(string key, string defaultValue)
    {
        var setting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == key);
        return setting?.Value ?? defaultValue;
    }

    public async Task<int> GetIntSettingAsync(string key, int defaultValue)
    {
        var settingStr = await GetSettingAsync(key, defaultValue.ToString());
        if (int.TryParse(settingStr, out int result))
        {
            return result;
        }
        return defaultValue;
    }

    public async Task SetSettingAsync(string key, string value)
    {
        var setting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == key);
        if (setting == null)
        {
            _context.SystemSettings.Add(new SystemSetting { Key = key, Value = value });
        }
        else
        {
            setting.Value = value;
        }
        await _context.SaveChangesAsync();
    }

    public async Task<Dictionary<string, string>> GetAllSettingsAsync()
    {
        return await _context.SystemSettings.ToDictionaryAsync(s => s.Key, s => s.Value);
    }
}
