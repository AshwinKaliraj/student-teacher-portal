using Microsoft.EntityFrameworkCore;
using StudentApp.Models;
using StudentApp.Models.Entities;
using System;

namespace StudentApp.Tests.Helpers
{
    /// <summary>
    /// Factory for creating in-memory database context for testing
    /// Provides isolated test data for each test
    /// </summary>
    public static class TestDbContextFactory
    {
        /// <summary>
        /// Creates a new in-memory database context with seeded test data
        /// Each call creates a unique database to avoid test interference
        /// </summary>
        public static SchoolContext CreateInMemoryContext()
        {
            // Create unique database name for each test
            var options = new DbContextOptionsBuilder<SchoolContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var context = new SchoolContext(options);

            // Seed test data
            SeedTestData(context);

            return context;
        }

        /// <summary>
        /// Seeds the database with test users
        /// </summary>
        private static void SeedTestData(SchoolContext context)
        {
            var users = new[]
            {
                new User
                {
                    Id = 1,
                    Name = "Test Teacher",
                    Email = "teacher@test.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                    DateOfBirth = new DateTime(1985, 5, 15),
                    Designation = "Teacher",
                    Department = "Computer Science",
                    PhoneNumber = "1234567890",
                    Address = "123 Test Street",
                    ImageUrl = "https://ui-avatars.com/api/?name=Test+Teacher",
                    EnrollmentDate = null,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = 2,
                    Name = "Test Student",
                    Email = "student@test.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                    DateOfBirth = new DateTime(2000, 8, 20),
                    Designation = "Student",
                    Department = "Engineering",
                    PhoneNumber = "9876543210",
                    Address = "456 Test Avenue",
                    ImageUrl = "https://ui-avatars.com/api/?name=Test+Student",
                    EnrollmentDate = DateTime.UtcNow.AddYears(-2),
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };

            context.Users.AddRange(users);
            context.SaveChanges();
        }
    }
}
