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

    [HttpPost]
    public async Task<ActionResult<TransactionDto>> CreateTransaction(TransactionCreateDto dto)
    {
        var transaction = _mapper.Map<Transaction>(dto);
        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTransactions), new { id = transaction.Id }, _mapper.Map<TransactionDto>(transaction));
    }
}
