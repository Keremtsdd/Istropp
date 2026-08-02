using System;
using System.Collections.Generic;

namespace IstropAviary.API.Models;

public class Sale
{
    public int Id { get; set; }
    public string SaleNumber { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    
    public string? CustomerName { get; set; }
    public string? CustomerPhone { get; set; }
    public string? CustomerCity { get; set; }
    
    public string? PaymentType { get; set; }
    public decimal TotalAmount { get; set; }
    public string? Notes { get; set; }

    public ICollection<SaleDetail> SaleDetails { get; set; } = new List<SaleDetail>();
}

public class SaleDetail
{
    public int Id { get; set; }
    public int SaleId { get; set; }
    public Sale? Sale { get; set; }

    public int BirdId { get; set; }
    public Bird? Bird { get; set; }

    public decimal Price { get; set; }
}
