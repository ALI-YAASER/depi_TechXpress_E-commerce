using backend.DTOs.Auth;
using backend.Helpers;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
	private readonly AuthService _auth;
	public AuthController(AuthService auth) => _auth = auth;

	[HttpPost("register")]
	public async Task<IActionResult> Register(RegisterRequest req)
	{
		var (result, errors) = await _auth.RegisterAsync(req);
		if (result is null)
			return BadRequest(ApiResponse.Fail("Registration failed.",
				new Dictionary<string, string[]> { ["errors"] = errors.ToArray() }));
		return StatusCode(StatusCodes.Status201Created, result);
	}

	[HttpPost("login")]
	public async Task<IActionResult> Login(LoginRequest req)
	{
		var result = await _auth.LoginAsync(req);
		// نفس الرسالة للإيميل الغلط والباسورد الغلط والحساب المقفول: علشان ما نكشفش مين مسجّل.
		return result is null ? Unauthorized(ApiResponse.Fail("Invalid email or password.")) : Ok(result);
	}

	[Authorize]
	[HttpGet("me")]
	public async Task<IActionResult> Me()
	{
		var id = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
		var dto = await _auth.GetUserDtoAsync(id);
		return dto is null ? Unauthorized() : Ok(dto);
	}
}
