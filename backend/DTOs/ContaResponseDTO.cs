namespace GestaoFinanceira.DTOs;

public class ContaResponseDTO
{
    public int Id { get; set; }

    public string Nome { get; set; }

    public decimal Saldo { get; set; }

    public int UsuarioId { get; set; }

    public string NomeUsuario { get; set; }
}