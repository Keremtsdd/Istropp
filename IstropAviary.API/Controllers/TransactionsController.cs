using AutoMapper;
using IstropAviary.API.Data;
using IstropAviary.API.DTOs;
using IstropAviary.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IstropAviary.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public TransactionsController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactions()
    {
        var transactions = await _context.Transactions
            .AsNoTracking()
            .ToListAsync();

        return Ok(_mapper.Map<IEnumerable<TransactionDto>>(transactions));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TransactionDto>> GetTransaction(int id)
    {
        var transaction = await _context.Transactions
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id);

        if (transaction == null)
            return NotFound();

        return Ok(_mapper.Map<TransactionDto>(transaction));
    }

    [HttpPost]
    public async Task<ActionResult<TransactionDto>> CreateTransaction(TransactionCreateDto dto)
    {
        var transaction = _mapper.Map<Transaction>(dto);
        transaction.Date = DateTime.SpecifyKind(transaction.Date, DateTimeKind.Utc);
        
        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTransaction), new { id = transaction.Id }, _mapper.Map<TransactionDto>(transaction));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateTransaction(int id, TransactionCreateDto dto)
    {
        var transaction = await _context.Transactions.FindAsync(id);
        if (transaction == null)
            return NotFound();

        transaction.Date = DateTime.SpecifyKind(dto.Date, DateTimeKind.Utc);
        transaction.Description = dto.Description;
        transaction.Type = dto.Type;
        transaction.Category = dto.Category;
        transaction.Amount = dto.Amount;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTransaction(int id)
    {
        var transaction = await _context.Transactions.FindAsync(id);
        if (transaction == null)
            return NotFound();

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
