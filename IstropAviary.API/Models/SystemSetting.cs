using System;

namespace IstropAviary.API.Models;

public class SystemSetting
{
    public int Id { get; set; }
    public string Key { get; set; } = string.Empty; // e.g., "HatchDurationDays"
    public string Value { get; set; } = string.Empty; // e.g., "21"
    public string? Description { get; set; }
}
