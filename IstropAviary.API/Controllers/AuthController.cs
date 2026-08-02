using IstropAviary.API.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace IstropAviary.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    // Hardcoded for demo/single-user setup. In real world, use DB and Hash.
    private const string AdminUser = "admin";
    private const string AdminPass = "admin123";

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDto login)
    {
        if (login.Username == AdminUser && login.Password == AdminPass)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("SuperSecretKey123!_NeedsToBeLongEnough");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, login.Username) }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return Ok(new { Token = tokenHandler.WriteToken(token) });
        }

        return Unauthorized(new { Message = "Kullanıcı adı veya şifre hatalı!" });
    }
}
