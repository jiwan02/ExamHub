using Examhub.Data;
using Examhub.Models;
using Examhub.Models.DTOs;
using Examhub.Utils;
using Examhub.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace Examhub.Controllers
{
        [ApiController]
        [Route("api/[controller]")]
        public class AuthController : ControllerBase
        {
            private readonly ApplicationDbContext _context;
            private readonly JwtHelper _jwtHelper;

            public AuthController(ApplicationDbContext context)
            {
                _context = context;
                _jwtHelper = new JwtHelper("your-very-secure-key-here-32chars-long");
            }

            [HttpPost("register")]
            public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username))
                    return BadRequest("Username already exists");

                var user = new User
                {
                    Username = registerDto.Username,
                    Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                    UserType = "User",
                    CreatedDate = DateTime.UtcNow,
                    UpdatedDate = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = "User registered successfully" });
            }

            [HttpPost("login")]
            public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == loginDto.Username);

                if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
                    return BadRequest("Invalid credentials");

                var token = _jwtHelper.GenerateToken(user.Username, user.UserType, user.Id);

                return Ok(new
                {
                    token,
                    userType = user.UserType,
                    username = user.Username
                });
            }

            [HttpPost("change-password")]
            [Authorize]
            public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto request)
            {
                try
                {
                    var userId = GetLoggedInUserId();
                    var user = await _context.Users.FindAsync(userId);

                    if (user == null)
                        return NotFound(new { message = "User not found" });

                    if (user.UserType != "Admin")
                    {
                        if (string.IsNullOrEmpty(request.OldPassword) ||
                            !BCrypt.Net.BCrypt.Verify(request.OldPassword, user.Password))
                            return BadRequest(new { message = "Current password is incorrect" });
                    }

                    if (string.IsNullOrEmpty(request.NewPassword) || request.NewPassword.Length < 8)
                        return BadRequest(new { message = "New password must be at least 8 characters" });

                    user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                    user.UpdatedDate = DateTime.UtcNow;
                    await _context.SaveChangesAsync();

                    return Ok(new { message = "Password updated successfully" });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { error = "An error occurred", details = ex.Message });
                }
            }

            private int GetLoggedInUserId()
            {
                return int.Parse(User.FindFirst("UserId")?.Value ?? "0");
            }
        }
}
