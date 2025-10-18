using System;
using System.ComponentModel.DataAnnotations;

namespace StudentApp.Models.DTOs
{
    public class RegisterDTO
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Date of Birth is required")]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "Designation is required")]
        [RegularExpression("^(Student|Teacher)$", ErrorMessage = "Designation must be 'Student' or 'Teacher'")]
        public string Designation { get; set; } = string.Empty;

        public string? Department { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }

        // ✅ NEW FIELD
        [StringLength(500)]
        [Url(ErrorMessage = "Please enter a valid URL")]
        public string? ImageUrl { get; set; }
    }

    public class LoginDTO
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponseDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public string? Department { get; set; }

        // ✅ NEW FIELD
        public string? ImageUrl { get; set; }

        public string Token { get; set; } = string.Empty;
        public DateTime TokenExpiration { get; set; }
    }
}
