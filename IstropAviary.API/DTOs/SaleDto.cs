using IstropAviary.API.Models;
using System;
using System.Collections.Generic;

namespace IstropAviary.API.DTOs;

public class SaleDto
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

    public ICollection<SaleDetailDto> SaleDetails { get; set; } = new List<SaleDetailDto>();
}

public class SaleDetailDto
{
    public int Id { get; set; }
    public int BirdId { get; set; }
    public string? BirdBandNumber { get; set; }
    public decimal Price { get; set; }
}

public class SaleCreateDto
{
    public string SaleNumber { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string? CustomerName { get; set; }
    public string? CustomerPhone { get; set; }
    public string? CustomerCity { get; set; }
    public string? PaymentType { get; set; }
    public decimal TotalAmount { get; set; }
    public string? Notes { get; set; }

    public ICollection<SaleDetailCreateDto> SaleDetails { get; set; } = new List<SaleDetailCreateDto>();
}

public class SaleDetailCreateDto
{
    public int BirdId { get; set; }
    public decimal Price { get; set; }
}
