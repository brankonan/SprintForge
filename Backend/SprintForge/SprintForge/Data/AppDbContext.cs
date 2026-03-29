using Microsoft.EntityFrameworkCore;
using SprintForge.Models;

namespace SprintForge.Data;

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