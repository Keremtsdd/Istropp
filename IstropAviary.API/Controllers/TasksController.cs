using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IstropAviary.API.Data;
using IstropAviary.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IstropAviary.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;

    public TasksController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<SystemTask>>> GetTasks()
    {
        var tasks = await _context.SystemTasks
            .Where(t => !t.IsCompleted)
            .OrderBy(t => t.DueDate)
            .ToListAsync();

        return Ok(tasks);
    }

    [HttpPost("{id}/complete")]
    public async Task<IActionResult> CompleteTask(int id)
    {
        var task = await _context.SystemTasks.FindAsync(id);
        if (task == null)
            return NotFound();

        task.IsCompleted = true;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Görev tamamlandı olarak işaretlendi." });
    }
}
