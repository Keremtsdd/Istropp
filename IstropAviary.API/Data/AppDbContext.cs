using Microsoft.EntityFrameworkCore;
using IstropAviary.API.Models;

namespace IstropAviary.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Aviary> Aviaries { get; set; }
    public DbSet<Bird> Birds { get; set; }
    public DbSet<Nest> Nests { get; set; }
    public DbSet<Clutch> Clutches { get; set; }
    public DbSet<Sale> Sales { get; set; }
    public DbSet<SaleDetail> SaleDetails { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<CarePlan> CarePlans { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Self-referencing relationships for Mother and Father
        modelBuilder.Entity<Bird>()
            .HasOne(b => b.Mother)
            .WithMany()
            .HasForeignKey(b => b.MotherId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Bird>()
            .HasOne(b => b.Father)
            .WithMany()
            .HasForeignKey(b => b.FatherId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
