using Microsoft.EntityFrameworkCore;
using SprintForge.Domain.Entities;

namespace SprintForge.Infrastructure;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Sprint> Sprints { get; set; }
    public DbSet<SprintTask> SprintTasks { get; set; }
    public DbSet<Artifact> Artifacts { get; set; }
}
