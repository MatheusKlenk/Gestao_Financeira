using GestaoFinanceira.Data;
using GestaoFinanceira.DTOs;
using GestaoFinanceira.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GestaoFinanceira.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ContaController : ControllerBase
{
    private readonly AppDbContext _context;

    public ContaController(AppDbContext context)
    {
        _context = context;
    }

    // Helper: retorna o usuarioId do token JWT
    private int GetUsuarioIdFromToken()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(claim, out var id) ? id : 0;
    }

    private bool IsAdmin() => User.IsInRole("ADMIN");

    // GET /api/Conta — Admin vê tudo; usuário comum vê só as suas
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContaResponseDTO>>> GetContas()
    {
        IQueryable<Conta> query = _context.Contas.Include(c => c.Usuario);

        if (!IsAdmin())
        {
            var usuarioId = GetUsuarioIdFromToken();
            query = query.Where(c => c.UsuarioId == usuarioId);
        }

        var contas = await query
            .Select(c => new ContaResponseDTO
            {
                Id = c.Id,
                Nome = c.Nome,
                Saldo = c.Saldo,
                UsuarioId = c.UsuarioId,
                NomeUsuario = c.Usuario.Nome
            })
            .ToListAsync();

        return Ok(contas);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ContaResponseDTO>> GetConta(int id)
    {
        var conta = await _context.Contas
            .Include(c => c.Usuario)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (conta == null)
            return NotFound(new { mensagem = "Conta não encontrada" });

        // Usuário comum só pode ver a própria conta
        if (!IsAdmin() && conta.UsuarioId != GetUsuarioIdFromToken())
            return Forbid();

        var response = new ContaResponseDTO
        {
            Id = conta.Id,
            Nome = conta.Nome,
            Saldo = conta.Saldo,
            UsuarioId = conta.UsuarioId,
            NomeUsuario = conta.Usuario.Nome
        };

        return Ok(response);
    }

    // GET /api/Conta/GetContasById/{usuarioId} — filtro por usuário
    [HttpGet("GetContasById/{usuarioId}")]
    public async Task<ActionResult<IEnumerable<ContaResponseDTO>>> GetContasById(int usuarioId)
    {
        // Usuário comum só pode consultar as próprias contas
        if (!IsAdmin() && usuarioId != GetUsuarioIdFromToken())
            return Forbid();

        var contas = await _context.Contas
            .Include(c => c.Usuario)
            .Where(c => c.UsuarioId == usuarioId)
            .Select(c => new ContaResponseDTO
            {
                Id = c.Id,
                Nome = c.Nome,
                Saldo = c.Saldo,
                UsuarioId = c.UsuarioId,
                NomeUsuario = c.Usuario.Nome
            })
            .ToListAsync();

        return Ok(contas);
    }

    [HttpPost]
    public async Task<ActionResult> PostConta(ContaCreateDTO dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Usuário comum só pode criar conta para si mesmo
        if (!IsAdmin() && dto.UsuarioId != GetUsuarioIdFromToken())
            return Forbid();

        var usuario = await _context.Usuarios.FindAsync(dto.UsuarioId);
        if (usuario == null)
            return BadRequest(new { mensagem = "Usuário não encontrado" });

        var conta = new Conta
        {
            Nome = dto.Nome,
            Saldo = dto.Saldo,
            UsuarioId = dto.UsuarioId
        };

        _context.Contas.Add(conta);
        await _context.SaveChangesAsync();

        var response = new ContaResponseDTO
        {
            Id = conta.Id,
            Nome = conta.Nome,
            Saldo = conta.Saldo,
            UsuarioId = conta.UsuarioId,
            NomeUsuario = usuario.Nome
        };

        return CreatedAtAction(nameof(GetConta), new { id = conta.Id }, response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutConta(int id, ContaCreateDTO dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var conta = await _context.Contas.FindAsync(id);
        if (conta == null)
            return NotFound(new { mensagem = "Conta não encontrada" });

        // Usuário comum só pode editar a própria conta
        if (!IsAdmin() && conta.UsuarioId != GetUsuarioIdFromToken())
            return Forbid();

        var usuario = await _context.Usuarios.FindAsync(dto.UsuarioId);
        if (usuario == null)
            return BadRequest(new { mensagem = "Usuário não encontrado" });

        conta.Nome = dto.Nome;
        conta.Saldo = dto.Saldo;
        conta.UsuarioId = dto.UsuarioId;

        await _context.SaveChangesAsync();

        return Ok(new { mensagem = "Conta atualizada com sucesso" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteConta(int id)
    {
        var conta = await _context.Contas.FindAsync(id);
        if (conta == null)
            return NotFound(new { mensagem = "Conta não encontrada" });

        // Usuário comum só pode remover a própria conta
        if (!IsAdmin() && conta.UsuarioId != GetUsuarioIdFromToken())
            return Forbid();

        _context.Contas.Remove(conta);
        await _context.SaveChangesAsync();

        return Ok(new { mensagem = "Conta removida com sucesso" });
    }
}
