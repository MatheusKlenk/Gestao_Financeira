using GestaoFinanceira.Data;
using GestaoFinanceira.Models;
using GestaoFinanceira.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace GestaoFinanceira.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TransacaoController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransacaoController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransacaoResponseDTO>>> GetTransacoes()
    {
        var transacoes = await _context.Transacoes
            .Include(t => t.Conta)
            .Select(t => new TransacaoResponseDTO
            {
                Id = t.Id,
                Descricao = t.Descricao,
                Valor = t.Valor,
                Tipo = t.Tipo,
                Data = t.Data,
                ContaId = t.ContaId,
                NomeConta = t.Conta.Nome
            })
            .ToListAsync();

        return Ok(transacoes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TransacaoResponseDTO>> GetTransacao(int id)
    {
        var transacao = await _context.Transacoes
            .Include(t => t.Conta)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (transacao == null)
        {
            return NotFound(new
            {
                mensagem = "Transação não encontrada"
            });
        }

        var response = new TransacaoResponseDTO
        {
            Id = transacao.Id,
            Descricao = transacao.Descricao,
            Valor = transacao.Valor,
            Tipo = transacao.Tipo,
            Data = transacao.Data,
            ContaId = transacao.ContaId,
            NomeConta = transacao.Conta.Nome
        };

        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult> PostTransacao(TransacaoCreateDTO dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var conta = await _context.Contas.FindAsync(dto.ContaId);

        if (conta == null)
        {
            return BadRequest(new
            {
                mensagem = "Conta não encontrada"
            });
        }

        var transacao = new Transacao
        {
            Descricao = dto.Descricao,
            Valor = dto.Valor,
            Tipo = dto.Tipo,
            Data = dto.Data,
            ContaId = dto.ContaId
        };

        if (transacao.Tipo == "credito")
            conta.Saldo += transacao.Valor;
        else if (transacao.Tipo == "debito")
            conta.Saldo -= transacao.Valor;

        _context.Transacoes.Add(transacao);

        await _context.SaveChangesAsync();

        var response = new TransacaoResponseDTO
        {
            Id = transacao.Id,
            Descricao = transacao.Descricao,
            Valor = transacao.Valor,
            Tipo = transacao.Tipo,
            Data = transacao.Data,
            ContaId = transacao.ContaId,
            NomeConta = conta.Nome
        };

        return CreatedAtAction(nameof(GetTransacao), new { id = transacao.Id }, response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutTransacao(int id, TransacaoCreateDTO dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var transacaoAntiga = await _context.Transacoes.FindAsync(id);

        if (transacaoAntiga == null)
        {
            return NotFound(new
            {
                mensagem = "Transação não encontrada"
            });
        }

        var conta = await _context.Contas.FindAsync(dto.ContaId);

        if (conta == null)
        {
            return BadRequest(new
            {
                mensagem = "Conta não encontrada"
            });
        }

        // Remove efeito antigo do saldo
        if (transacaoAntiga.Tipo == "credito")
            conta.Saldo -= transacaoAntiga.Valor;
        else if (transacaoAntiga.Tipo == "debito")
            conta.Saldo += transacaoAntiga.Valor;

        // Aplica novo valor
        if (dto.Tipo == "credito")
            conta.Saldo += dto.Valor;
        else if (dto.Tipo == "debito")
            conta.Saldo -= dto.Valor;

        transacaoAntiga.Descricao = dto.Descricao;
        transacaoAntiga.Valor = dto.Valor;
        transacaoAntiga.Tipo = dto.Tipo;
        transacaoAntiga.Data = dto.Data;
        transacaoAntiga.ContaId = dto.ContaId;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            mensagem = "Transação atualizada com sucesso"
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTransacao(int id)
    {
        var transacao = await _context.Transacoes.FindAsync(id);
        if (transacao == null)
            return NotFound(new
            {
                mensagem = "Transação não encontrada"
            });

        var conta = await _context.Contas.FindAsync(transacao.ContaId);

        if (conta != null)
        {
            if (transacao.Tipo == "credito")
                conta.Saldo -= transacao.Valor;
            else if (transacao.Tipo == "debito")
                conta.Saldo += transacao.Valor;
        }

        _context.Transacoes.Remove(transacao);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            mensagem = "Transação removida com sucesso"
        });
    }
}