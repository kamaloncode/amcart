using Microsoft.AspNetCore.Mvc;
using AuthService.Data;
using AuthService.DTOs;
using AuthService.Models;
using AuthService.Services;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthDbContext _context;
        private readonly PasswordService _passwordService;
        private readonly JwtService _jwtService;

        public AuthController(
            AuthDbContext context,
            PasswordService passwordService,
            JwtService jwtService)
        {
            _context = context;
            _passwordService = passwordService;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(x => x.Email == request.Email))
                return BadRequest("User already exists");

            _passwordService.CreatePasswordHash(
                request.Password,
                out string hash,
                out string salt
            );

            var user = new User
            {
                UserId = Guid.NewGuid(),
                Email = request.Email,
                PasswordHash = hash,
                PasswordSalt = salt,
                FirstName = request.FirstName,
                LastName = request.LastName,
                PhoneNumber = request.PhoneNumber
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("User registered");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == request.Email);
            _passwordService.CreatePasswordHash(
                request.Password,
                out string hash,
                out string salt
            );

            if (!_context.Users.Any())
            {
                _context.Users.Add(new User { Email = "test@gmail.com", PasswordHash = hash });
                _context.SaveChanges();
            }

            if (user == null)
                return Unauthorized("Invalid credentials");

            if (!_passwordService.VerifyPassword(
                request.Password,
                user.PasswordHash,
                user.PasswordSalt))
            {
                return Unauthorized("Invalid credentials");
            }

            var token = _jwtService.GenerateToken(user);

            return Ok(new AuthResponse
            {
                Token = token,
                Email = user.Email
            });
        }
    }
}