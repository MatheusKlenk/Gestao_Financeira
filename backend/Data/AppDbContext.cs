using Microsoft.EntityFrameworkCore;
using GestaoFinanceira.Models;

namespace GestaoFinanceira.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Usuario> Usuarios { get; set; }

    public DbSet<Conta> Contas { get; set; }

    public DbSet<Transacao> Transacoes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Usuario>()
            .Property(u => u.Nome)
            .HasMaxLength(100);

        modelBuilder.Entity<Usuario>()
            .Property(u => u.Email)
            .HasMaxLength(100);

        modelBuilder.Entity<Usuario>()
            .Property(u => u.Senha)
            .HasMaxLength(100);
        
        modelBuilder.Entity<Conta>()
            .Property(c => c.Nome)
            .HasMaxLength(100);
        
        modelBuilder.Entity<Transacao>()
            .Property(t => t.Descricao)
            .HasMaxLength(100);

        modelBuilder.Entity<Transacao>()
            .Property(t => t.Tipo)
            .HasMaxLength(20);

        base.OnModelCreating(modelBuilder);
    }
}