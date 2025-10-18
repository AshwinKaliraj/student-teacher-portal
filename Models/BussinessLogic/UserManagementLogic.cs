using Microsoft.EntityFrameworkCore;
using StudentApp.Models;
using StudentApp.Models.DTOs;
using StudentApp.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentApp.Models.BusinessLogic
{
    public class UserManagementLogic
    {
        private readonly SchoolContext _context;

        public UserManagementLogic(SchoolContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserResponseDTO>> GetAllUsersAsync()
        {
            return await _context.Users
                .Where(u => u.IsActive)
                .OrderBy(u => u.Name)
                .Select(u => new UserResponseDTO
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    DateOfBirth = u.DateOfBirth,
                    Designation = u.Designation,
                    Department = u.Department,
                    PhoneNumber = u.PhoneNumber,
                    Address = u.Address,
                    ImageUrl = u.ImageUrl,  // ✅ NEW FIELD
                    EnrollmentDate = u.EnrollmentDate,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<UserResponseDTO> GetUserByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {id} not found");
            }

            return new UserResponseDTO
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                DateOfBirth = user.DateOfBirth,
                Designation = user.Designation,
                Department = user.Department,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                ImageUrl = user.ImageUrl,  // ✅ NEW FIELD
                EnrollmentDate = user.EnrollmentDate,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<UserResponseDTO> CreateUserAsync(UserCreateDTO userDTO)
        {
            if (await _context.Users.AnyAsync(u => u.Email == userDTO.Email.ToLower()))
            {
                throw new InvalidOperationException("User with this email already exists");
            }

            var age = DateTime.Now.Year - userDTO.DateOfBirth.Year;
            if (age < 10)
            {
                throw new InvalidOperationException("User must be at least 10 years old");
            }

            DateTime? enrollmentDate = userDTO.EnrollmentDate;
            if (userDTO.Designation == "Student" && !enrollmentDate.HasValue)
            {
                enrollmentDate = DateTime.UtcNow;
            }

            // ✅ Generate default avatar if no image provided
            string imageUrl = userDTO.ImageUrl;
            if (string.IsNullOrWhiteSpace(imageUrl))
            {
                imageUrl = GenerateDefaultAvatar(userDTO.Name);
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(userDTO.Password);

            var user = new User
            {
                Name = userDTO.Name,
                Email = userDTO.Email.ToLower(),
                PasswordHash = passwordHash,
                DateOfBirth = userDTO.DateOfBirth,
                Designation = userDTO.Designation,
                Department = userDTO.Department,
                PhoneNumber = userDTO.PhoneNumber,
                Address = userDTO.Address,
                ImageUrl = imageUrl,  // ✅ NEW FIELD
                EnrollmentDate = enrollmentDate,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return await GetUserByIdAsync(user.Id);
        }

        public async Task<UserResponseDTO> UpdateUserAsync(UserUpdateDTO userDTO)
        {
            var user = await _context.Users.FindAsync(userDTO.Id);

            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {userDTO.Id} not found");
            }

            var age = DateTime.Now.Year - userDTO.DateOfBirth.Year;
            if (age < 10)
            {
                throw new InvalidOperationException("User must be at least 10 years old");
            }

            user.Name = userDTO.Name;
            user.DateOfBirth = userDTO.DateOfBirth;
            user.Designation = userDTO.Designation;
            user.Department = userDTO.Department;
            user.PhoneNumber = userDTO.PhoneNumber;
            user.Address = userDTO.Address;
            user.ImageUrl = userDTO.ImageUrl;  // ✅ NEW FIELD
            user.EnrollmentDate = userDTO.EnrollmentDate;
            user.IsActive = userDTO.IsActive;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetUserByIdAsync(user.Id);
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return false;
            }

            user.IsActive = false;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<UserResponseDTO>> GetUsersByDesignationAsync(string designation)
        {
            if (designation != "Student" && designation != "Teacher")
            {
                throw new ArgumentException("Designation must be 'Student' or 'Teacher'");
            }

            return await _context.Users
                .Where(u => u.Designation == designation && u.IsActive)
                .OrderBy(u => u.Name)
                .Select(u => new UserResponseDTO
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    DateOfBirth = u.DateOfBirth,
                    Designation = u.Designation,
                    Department = u.Department,
                    PhoneNumber = u.PhoneNumber,
                    Address = u.Address,
                    ImageUrl = u.ImageUrl,  // ✅ NEW FIELD
                    EnrollmentDate = u.EnrollmentDate,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<UserResponseDTO>> SearchUsersByNameAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return await GetAllUsersAsync();
            }

            return await _context.Users
                .Where(u => u.IsActive && u.Name.Contains(searchTerm))
                .OrderBy(u => u.Name)
                .Select(u => new UserResponseDTO
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    DateOfBirth = u.DateOfBirth,
                    Designation = u.Designation,
                    Department = u.Department,
                    PhoneNumber = u.PhoneNumber,
                    Address = u.Address,
                    ImageUrl = u.ImageUrl,  // ✅ NEW FIELD
                    EnrollmentDate = u.EnrollmentDate,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();
        }

        // ✅ NEW METHOD - Generate default avatar
        private string GenerateDefaultAvatar(string name)
        {
            return $"https://ui-avatars.com/api/?name={Uri.EscapeDataString(name)}&background=667eea&color=fff&size=200&bold=true";
        }
    }
}
