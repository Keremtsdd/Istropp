using System;

namespace IstropAviary.API.Models;

public class SystemTask
{
    public int Id { get; set; }
    public SystemTaskType TaskType { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public bool IsCompleted { get; set; } = false;
    
    // Optional context links to quickly jump to the relevant record
    public int? RelatedEggId { get; set; }
    public int? RelatedBirdId { get; set; }
    public int? RelatedPairId { get; set; }
}
