using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Moq;
using StudentApp.Models.BusinessLogic;
using StudentApp.Models.DTOs;
using StudentApp.Tests.Helpers;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace StudentApp.Tests.BusinessLogic
{
    /// <summary>
    /// Unit tests for AuthenticationLogic
    /// Tests user registration, login, and JWT token generation
    /// </summary>
    public class AuthenticationLogicTests : IDisposable
    {
        private readonly AuthenticationLogic _authLogic;
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly StudentApp.Models.SchoolContext _context;

        public AuthenticationLogicTests()
        {
            // Arrange: Setup test dependencies
            _context = TestDbContextFactory.CreateInMemoryContext();

            _mockConfiguration = new Mock<IConfiguration>();
            _mockConfiguration.Setup(c => c["Jwt:Key"])
                .Returns("YourSuperSecretKeyMustBeAtLeast32CharactersLongForHS256Algorithm");
            _mockConfiguration.Setup(c => c["Jwt:Issuer"])
                .Returns("https://localhost:5182");
            _mockConfiguration.Setup(c => c["Jwt:Audience"])
                .Returns("https://localhost:5182");

            _authLogic = new AuthenticationLogic(_context, _mockConfiguration.Object);
        }

        [Fact]
        public async Task RegisterUserAsync_WithValidData_ShouldCreateUserAndReturnToken()
        {
            // Arrange
            var registerDTO = new RegisterDTO
            {
                Name = "New User",
                Email = "newuser@test.com",
                Password = "password123",
                DateOfBirth = new DateTime(1995, 1, 1),
                Designation = "Student",
                Department = "Mathematics"
            };

            // Act
            var result = await _authLogic.RegisterUserAsync(registerDTO);

            // Assert
            result.Should().NotBeNull();
            result.Name.Should().Be("New User");
            result.Email.Should().Be("newuser@test.com");
            result.Token.Should().NotBeNullOrEmpty();
        }

        [Fact]
        public async Task RegisterUserAsync_WithDuplicateEmail_ShouldThrowException()
        {
            // Arrange
            var registerDTO = new RegisterDTO
            {
                Name = "Duplicate",
                Email = "teacher@test.com",
                Password = "password123",
                DateOfBirth = new DateTime(1995, 1, 1),
                Designation = "Teacher"
            };

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(
                async () => await _authLogic.RegisterUserAsync(registerDTO));
        }

        [Fact]
        public async Task LoginUserAsync_WithValidCredentials_ShouldReturnToken()
        {
            // Arrange
            var loginDTO = new LoginDTO
            {
                Email = "teacher@test.com",
                Password = "password123"
            };

            // Act
            var result = await _authLogic.LoginUserAsync(loginDTO);

            // Assert
            result.Should().NotBeNull();
            result.Token.Should().NotBeNullOrEmpty();
        }

        [Fact]
        public async Task LoginUserAsync_WithInvalidPassword_ShouldThrowException()
        {
            // Arrange
            var loginDTO = new LoginDTO
            {
                Email = "teacher@test.com",
                Password = "wrongpassword"
            };

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                async () => await _authLogic.LoginUserAsync(loginDTO));
        }

        [Fact]
        public async Task UserExistsAsync_WithExistingEmail_ShouldReturnTrue()
        {
            // Act
            var exists = await _authLogic.UserExistsAsync("teacher@test.com");

            // Assert
            exists.Should().BeTrue();
        }

        public void Dispose()
        {
            _context?.Database.EnsureDeleted();
            _context?.Dispose();
        }
    }
}
