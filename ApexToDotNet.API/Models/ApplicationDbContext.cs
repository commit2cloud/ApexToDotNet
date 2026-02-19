using Microsoft.EntityFrameworkCore;

namespace ApexToDotNet.API.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Project> Projects { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<Task> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure decimal precision if necessary, usually Oracle NUMBER maps to decimal
            modelBuilder.Entity<Project>()
                .Property(p => p.Id)
                .HasColumnType("NUMBER");

             modelBuilder.Entity<Session>()
                .Property(s => s.Id)
                .HasColumnType("NUMBER");

             modelBuilder.Entity<Task>()
                .Property(t => t.TaskId)
                .HasColumnType("NUMBER");
        }
    }
}
