using System;

namespace IstropAviary.API.DTOs;

public class CarePlanDto
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Type { get; set; } 

    public int? RelatedBirdId { get; set; }
    public string? RelatedBirdBand { get; set; }

    public int? RelatedNestId { get; set; }
    public string? RelatedNestCode { get; set; }
}

public class CarePlanCreateDto
{
    public DateTime Date { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Type { get; set; } 

    public int? RelatedBirdId { get; set; }
    public int? RelatedNestId { get; set; }
}
