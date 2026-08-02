using IstropAviary.API.Models;
using System;

namespace IstropAviary.API.DTOs;

public class TransactionDto
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string? Category { get; set; }
    public decimal Amount { get; set; }
}

public class TransactionCreateDto
{
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public TransactionType Type { get; set; }
    public string? Category { get; set; }
    public decimal Amount { get; set; }
}
