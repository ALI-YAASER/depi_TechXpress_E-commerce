using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.DTOs.Auth;
using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services;

public class AuthService
{
    private readonly UserManager<ApplicationUser> _users;
    private readonly IConfiguration _config;

    public AuthService(UserManager<ApplicationUser> users, IConfiguration config)
    {
        _users = users;
        _config = config;
    }

    public async Task<(AuthResponse? Result, IEnumerable<string> Errors)> RegisterAsync(RegisterRequest req)
    {
        var user = new ApplicationUser
        {
            UserName = req.Email.Trim(),
            Email = req.Email.Trim(),
            FullName = req.FullName.Trim()
        };
        var create = await _users.CreateAsync(user, req.Password);
        if (!create.Succeeded) return (null, create.Errors.Select(e => e.Description));

        // التسجيل العام بيدّي دور Customer بس. الأدمن بيتعمل من الـ seeder فقط.
        await _users.AddToRoleAsync(user, Roles.Customer);
        return (await BuildResponseAsync(user), Array.Empty<string>());
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest req)
    {
        var user = await _users.FindByEmailAsync(req.Email.Trim());
        if (user is null) return null;
        if (await _users.IsLockedOutAsync(user)) return null;

        if (!await _users.CheckPasswordAsync(user, req.Password))
        {
            await _users.AccessFailedAsync(user); // قفل مؤقت بعد محاولات فاشلة متكررة
            return null;
        }
        await _users.ResetAccessFailedCountAsync(user);
        return await BuildResponseAsync(user);
    }

    public async Task<UserDto?> GetUserDtoAsync(string userId)
    {
        var user = await _users.FindByIdAsync(userId);
        if (user is null) return null;
        return new UserDto(user.Id, user.FullName, user.Email!, await _users.GetRolesAsync(user));
    }

    private async Task<AuthResponse> BuildResponseAsync(ApplicationUser user)
    {
        var roles = await _users.GetRolesAsync(user);
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Email, user.Email!),
            new(ClaimTypes.Name, user.FullName)
        };
        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var expires = DateTime.UtcNow.AddMinutes(_config.GetValue("Jwt:ExpiryMinutes", 120));
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

        return new AuthResponse(new JwtSecurityTokenHandler().WriteToken(token), expires,
            new UserDto(user.Id, user.FullName, user.Email!, roles));
    }
}
