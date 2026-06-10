namespace GestaoFinanceira.DTOs;

public class TransacaoResponseDTO
{
    public int Id { get; set; }

    public string Descricao { get; set; }

    public decimal Valor { get; set; }

    public string Tipo { get; set; }

    public DateTime Data { get; set; }

    public int ContaId { get; set; }

    public string NomeConta { get; set; }
}