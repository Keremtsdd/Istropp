using System;

namespace IstropAviary.API.Models;

public class Transaction
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public TransactionType Type { get; set; }
    public string? Category { get; set; }
    public decimal Amount { get; set; }
}
