using IstropAviary.API.Models;
using System;

namespace IstropAviary.API.DTOs;

public class NestDto
{
    public int Id { get; set; }
    public string NestCode { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    
    public int? AviaryId { get; set; }
    public string? AviaryName { get; set; }

    public string? NextAction { get; set; }
    public DateTime? NextActionDate { get; set; }
}
