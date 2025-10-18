using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentApp.Models;
using StudentApp.Models.BusinessLogic;
using StudentApp.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StudentApp.Controllers
{
    /// <summary>
    /// Users controller - CRUD operations with role-based authorization
    /// Teachers: Full CRUD access
    /// Students: Read-only access
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly UserManagementLogic _userLogic;

        public UsersController(SchoolContext context)
        {
            _userLogic = new UserManagementLogic(context);
        }

        /// <summary>
        /// Get all users
        /// GET: api/users
        /// Accessible by: Students and Teachers
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDTO>>> GetAllUsers()
        {
            try
            {
                var users = await _userLogic.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving users", error = ex.Message });
            }
        }

        /// <summary>
        /// Get user by ID
        /// GET: api/users/{id}
        /// Accessible by: Students and Teachers
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponseDTO>> GetUserById(int id)
        {
            try
            {
                var user = await _userLogic.GetUserByIdAsync(id);
                return Ok(user);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving user", error = ex.Message });
            }
        }

        /// <summary>
        /// Get users by designation
        /// GET: api/users/designation/{designation}
        /// Accessible by: Students and Teachers
        /// </summary>
        [HttpGet("designation/{designation}")]
        public async Task<ActionResult<IEnumerable<UserResponseDTO>>> GetUsersByDesignation(string designation)
        {
            try
            {
                var users = await _userLogic.GetUsersByDesignationAsync(designation);
                return Ok(users);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving users", error = ex.Message });
            }
        }

        /// <summary>
        /// Search users by name
        /// GET: api/users/search?term={searchTerm}
        /// Accessible by: Students and Teachers
        /// </summary>
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<UserResponseDTO>>> SearchUsers([FromQuery] string term)
        {
            try
            {
                var users = await _userLogic.SearchUsersByNameAsync(term);
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error searching users", error = ex.Message });
            }
        }

        /// <summary>
        /// Create new user
        /// POST: api/users
        /// Accessible by: Teachers only
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Teacher")]
        public async Task<ActionResult<UserResponseDTO>> CreateUser([FromBody] UserCreateDTO userDTO)
        {
            try
            {
                var user = await _userLogic.CreateUserAsync(userDTO);
                return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating user", error = ex.Message });
            }
        }

        /// <summary>
        /// Update user
        /// PUT: api/users/{id}
        /// Accessible by: Teachers only
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Teacher")]
        public async Task<ActionResult<UserResponseDTO>> UpdateUser(int id, [FromBody] UserUpdateDTO userDTO)
        {
            if (id != userDTO.Id)
            {
                return BadRequest(new { message = "ID mismatch between route and body" });
            }

            try
            {
                var user = await _userLogic.UpdateUserAsync(userDTO);
                return Ok(user);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating user", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete user (soft delete)
        /// DELETE: api/users/{id}
        /// Accessible by: Teachers only
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var result = await _userLogic.DeleteUserAsync(id);

                if (!result)
                {
                    return NotFound(new { message = $"User with ID {id} not found" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting user", error = ex.Message });
            }
        }
    }
}
