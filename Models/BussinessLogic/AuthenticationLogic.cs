using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using StudentApp.Models;
using StudentApp.Models.DTOs;
using StudentApp.Models.Entities;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace StudentApp.Models.BusinessLogic
{
    public class AuthenticationLogic
    {
        private readonly SchoolContext _context;
        private readonly IConfiguration _configuration;

        public AuthenticationLogic(SchoolContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponseDTO> RegisterUserAsync(RegisterDTO registerDTO)
        {
            if (await UserExistsAsync(registerDTO.Email))
            {
                throw new InvalidOperationException("User with this email already exists");
            }

            var age = DateTime.Now.Year - registerDTO.DateOfBirth.Year;
            if (age < 10)
            {
                throw new InvalidOperationException("User must be at least 10 years old");
            }

            DateTime? enrollmentDate = registerDTO.Designation == "Student"
                ? DateTime.UtcNow
                : null;

            // ✅ Generate default avatar if no image provided
            string imageUrl = registerDTO.ImageUrl;
            if (string.IsNullOrWhiteSpace(imageUrl))
            {
                imageUrl = GenerateDefaultAvatar(registerDTO.Name);
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDTO.Password);

            var user = new User
            {
                Name = registerDTO.Name,
                Email = registerDTO.Email.ToLower(),
                PasswordHash = passwordHash,
                DateOfBirth = registerDTO.DateOfBirth,
                Designation = registerDTO.Designation,
                Department = registerDTO.Department,
                PhoneNumber = registerDTO.PhoneNumber,
                Address = registerDTO.Address,
                ImageUrl = imageUrl,  // ✅ NEW FIELD
                EnrollmentDate = enrollmentDate,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            return new AuthResponseDTO
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Designation = user.Designation,
                Department = user.Department,
                ImageUrl = user.ImageUrl,  // ✅ NEW FIELD
                Token = token,
                TokenExpiration = DateTime.UtcNow.AddHours(24)
            };
        }

        public async Task<AuthResponseDTO> LoginUserAsync(LoginDTO loginDTO)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDTO.Email.ToLower());

            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            if (!BCrypt.Net.BCrypt.Verify(loginDTO.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            if (!user.IsActive)
            {
                throw new UnauthorizedAccessException("Account is deactivated");
            }

            var token = GenerateJwtToken(user);

            return new AuthResponseDTO
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Designation = user.Designation,
                Department = user.Department,
                ImageUrl = user.ImageUrl,  // ✅ NEW FIELD
                Token = token,
                TokenExpiration = DateTime.UtcNow.AddHours(24)
            };
        }

        public async Task<bool> UserExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email.ToLower());
        }

        private string GenerateJwtToken(User user)
        {
            var jwtKey = _configuration["Jwt:Key"]
                ?? throw new InvalidOperationException("JWT Key not configured");

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Designation),
                new Claim("Department", user.Department ?? "")
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // ✅ NEW METHOD - Generate default avatar using UI Avatars
        private string GenerateDefaultAvatar(string name)
        {
            var initials = string.Join("", name.Split(' ').Select(n => n[0]));
            return $"https://ui-avatars.com/api/?name={Uri.EscapeDataString(name)}&background=667eea&color=fff&size=200&bold=true";
        }
    }
}
