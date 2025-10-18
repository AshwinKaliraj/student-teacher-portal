using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudentApp.Models.Entities
{
    /// <summary>
    /// User entity representing both Students and Teachers
    /// </summary>
    public partial class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = null!;

        [Required]
        [StringLength(100)]
        public string Email { get; set; } = null!;

        [Required]
        [StringLength(255)]
        public string PasswordHash { get; set; } = null!;

        public DateTime DateOfBirth { get; set; }

        [Required]
        [StringLength(20)]
        public string Designation { get; set; } = null!;

        [StringLength(100)]
        public string? Department { get; set; }

        [StringLength(20)]
        public string? PhoneNumber { get; set; }

        [StringLength(500)]
        public string? Address { get; set; }

        // ✅ NEW FIELD - ImageUrl
        [StringLength(500)]
        public string? ImageUrl { get; set; }

        public DateTime? EnrollmentDate { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}
