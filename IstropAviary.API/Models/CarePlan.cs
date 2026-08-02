using System;

namespace IstropAviary.API.Models;

public class CarePlan
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Type { get; set; } // Vitamin, Medicine, etc.

    public int? RelatedBirdId { get; set; }
    public Bird? RelatedBird { get; set; }

    public int? RelatedNestId { get; set; }
    public Nest? RelatedNest { get; set; }
}
