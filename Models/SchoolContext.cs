using Microsoft.EntityFrameworkCore;
using StudentApp.Models.Entities;

namespace StudentApp.Models
{
    public partial class SchoolContext : DbContext
    {
        public SchoolContext()
        {
        }

        public SchoolContext(DbContextOptions<SchoolContext> options)
            : base(options)
        {
        }

        public virtual DbSet<User> Users { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Connection configured in Program.cs
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");

                entity.HasIndex(e => e.Email, "IX_Users_Email").IsUnique();
                entity.HasIndex(e => e.Designation, "IX_Users_Designation");
                entity.HasIndex(e => e.IsActive, "IX_Users_IsActive");

                entity.Property(e => e.Address).HasMaxLength(500);
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("(getdate())")
                    .HasColumnType("datetime2");
                entity.Property(e => e.DateOfBirth).HasColumnType("datetime2");
                entity.Property(e => e.Department).HasMaxLength(100);
                entity.Property(e => e.Designation).HasMaxLength(20);
                entity.Property(e => e.Email).HasMaxLength(100);
                entity.Property(e => e.EnrollmentDate).HasColumnType("datetime2");

                // ✅ NEW FIELD Configuration
                entity.Property(e => e.ImageUrl).HasMaxLength(500);

                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.Name).HasMaxLength(100);
                entity.Property(e => e.PasswordHash).HasMaxLength(255);
                entity.Property(e => e.PhoneNumber).HasMaxLength(20);
                entity.Property(e => e.UpdatedAt)
                    .HasDefaultValueSql("(getdate())")
                    .HasColumnType("datetime2");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
