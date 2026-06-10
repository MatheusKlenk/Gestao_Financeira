using GestaoFinanceira.Data;
using GestaoFinanceira.DTOs;
using GestaoFinanceira.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace GestaoFinanceira.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public async Task<ActionResult> Login(LoginDTO loginDto)
    {
        var usuario = await _context.Usuarios
     .FirstOrDefaultAsync(u =>
         u.Email == loginDto.Email &&
         u.Senha == loginDto.Senha);

        Console.WriteLine($"Email recebido: {loginDto.Email}");
        Console.WriteLine($"Senha recebida: {loginDto.Senha}");

        if (usuario == null)
        {
            Console.WriteLine("USUARIO NÃO ENCONTRADO");
            return Unauthorized("Email ou senha inválidos.");
        }

        Console.WriteLine($"USUARIO ENCONTRADO: {usuario.Nome}");

        var tokenHandler = new JwtSecurityTokenHandler();

        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(ClaimTypes.Role, usuario.Role)
            }),

            Expires = DateTime.UtcNow.AddHours(2),

            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],

            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        var tokenString = tokenHandler.WriteToken(token);

        return Ok(new
        {
            token = tokenString,
            role = usuario.Role,
            nome = usuario.Nome
        });
    }

}