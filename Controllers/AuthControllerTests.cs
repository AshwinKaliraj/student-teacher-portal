using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Moq;
using StudentApp.Controllers;
using StudentApp.Models.DTOs;
using StudentApp.Tests.Helpers;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace StudentApp.Tests.Controllers
{
    /// <summary>
    /// Unit tests for AuthController
    /// Tests authentication API endpoints
    /// </summary>
    public class AuthControllerTests : IDisposable
    {
        private readonly AuthController _controller;
        private readonly StudentApp.Models.SchoolContext _context;
        private readonly Mock<IConfiguration> _mockConfiguration;

        public AuthControllerTests()
        {
            _context = TestDbContextFactory.CreateInMemoryContext();

            _mockConfiguration = new Mock<IConfiguration>();
            _mockConfiguration.Setup(c => c["Jwt:Key"])
                .Returns("YourSuperSecretKeyMustBeAtLeast32CharactersLongForHS256Algorithm");
            _mockConfiguration.Setup(c => c["Jwt:Issuer"])
                .Returns("https://localhost:5182");
            _mockConfiguration.Setup(c => c["Jwt:Audience"])
                .Returns("https://localhost:5182");

            _controller = new AuthController(_context, _mockConfiguration.Object);
        }

        [Fact]
        public async Task Register_WithValidData_ShouldReturnOk()
        {
            // Arrange
            var registerDTO = new RegisterDTO
            {
                Name = "API Test User",
                Email = "apitest@test.com",
                Password = "password123",
                DateOfBirth = new DateTime(1995, 6, 10),
                Designation = "Teacher",
                Department = "Biology"
            };

            // Act
            var result = await _controller.Register(registerDTO);

            // Assert
            result.Result.Should().BeOfType<OkObjectResult>();
        }

        [Fact]
        public async Task Login_WithValidCredentials_ShouldReturnOk()
        {
            // Arrange
            var loginDTO = new LoginDTO
            {
                Email = "teacher@test.com",
                Password = "password123"
            };

            // Act
            var result = await _controller.Login(loginDTO);

            // Assert
            result.Result.Should().BeOfType<OkObjectResult>();
        }

        [Fact]
        public async Task Login_WithInvalidPassword_ShouldReturnUnauthorized()
        {
            // Arrange
            var loginDTO = new LoginDTO
            {
                Email = "teacher@test.com",
                Password = "wrongpassword"
            };

            // Act
            var result = await _controller.Login(loginDTO);

            // Assert
            result.Result.Should().BeOfType<UnauthorizedObjectResult>();
        }

        public void Dispose()
        {
            _context?.Database.EnsureDeleted();
            _context?.Dispose();
        }
    }
}
