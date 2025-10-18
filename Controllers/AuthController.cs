using Microsoft.AspNetCore.Mvc;
using StudentApp.Models;
using StudentApp.Models.BusinessLogic;
using StudentApp.Models.DTOs;
using System;
using System.Threading.Tasks;

namespace StudentApp.Controllers
{
    /// <summary>
    /// Authentication controller
    /// Handles user registration and login
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthenticationLogic _authLogic;

        public AuthController(SchoolContext context, IConfiguration configuration)
        {
            _authLogic = new AuthenticationLogic(context, configuration);
        }

        /// <summary>
        /// Register new user
        /// POST: api/auth/register
        /// </summary>
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDTO>> Register([FromBody] RegisterDTO registerDTO)
        {
            try
            {
                var response = await _authLogic.RegisterUserAsync(registerDTO);
                return Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Registration error", error = ex.Message });
            }
        }

        /// <summary>
        /// Login user
        /// POST: api/auth/login
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDTO>> Login([FromBody] LoginDTO loginDTO)
        {
            try
            {
                var response = await _authLogic.LoginUserAsync(loginDTO);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Login error", error = ex.Message });
            }
        }

        /// <summary>
        /// Check if user exists
        /// GET: api/auth/exists/{email}
        /// </summary>
        [HttpGet("exists/{email}")]
        public async Task<ActionResult<bool>> UserExists(string email)
        {
            try
            {
                var exists = await _authLogic.UserExistsAsync(email);
                return Ok(new { exists });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error", error = ex.Message });
            }
        }
    }
}
