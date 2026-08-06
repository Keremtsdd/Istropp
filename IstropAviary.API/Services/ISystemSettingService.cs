using System.Collections.Generic;
using System.Threading.Tasks;

namespace IstropAviary.API.Services;

public interface ISystemSettingService
{
    Task<string> GetSettingAsync(string key, string defaultValue);
    Task SetSettingAsync(string key, string value);
    Task<int> GetIntSettingAsync(string key, int defaultValue);
    Task<Dictionary<string, string>> GetAllSettingsAsync();
}
