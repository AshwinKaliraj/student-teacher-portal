using System;
using System.ComponentModel.DataAnnotations;

namespace StudentApp.Models.DTOs
{
    public class UserResponseDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Designation { get; set; } = string.Empty;
        public string? Department { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }

        // ✅ NEW FIELD
        public string? ImageUrl { get; set; }

        public DateTime? EnrollmentDate { get; set; }
        public bool IsActive { get; set; }
        public int Age => DateTime.Now.Year - DateOfBirth.Year;
        public DateTime CreatedAt { get; set; }
    }

    public class UserCreateDTO
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        [RegularExpression("^(Student|Teacher)$")]
        public string Designation { get; set; } = string.Empty;

        public string? Department { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }

        // ✅ NEW FIELD
        [StringLength(500)]
        [Url(ErrorMessage = "Please enter a valid URL")]
        public string? ImageUrl { get; set; }

        public DateTime? EnrollmentDate { get; set; }
    }

    public class UserUpdateDTO
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        [RegularExpression("^(Student|Teacher)$")]
        public string Designation { get; set; } = string.Empty;

        public string? Department { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }

        // ✅ NEW FIELD
        [StringLength(500)]
        [Url(ErrorMessage = "Please enter a valid URL")]
        public string? ImageUrl { get; set; }

        public DateTime? EnrollmentDate { get; set; }
        public bool IsActive { get; set; }
    }
}
