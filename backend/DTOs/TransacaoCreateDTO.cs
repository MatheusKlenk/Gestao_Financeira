using System.ComponentModel.DataAnnotations;

namespace GestaoFinanceira.DTOs;

public class TransacaoCreateDTO
{
    [Required(ErrorMessage = "A descrição é obrigatória")]
    [StringLength(100, ErrorMessage = "Máximo de 100 caracteres")]
    public string Descricao { get; set; }

    [Required(ErrorMessage = "O valor é obrigatório")]
    public decimal Valor { get; set; }

    [Required(ErrorMessage = "O tipo é obrigatório")]
    [StringLength(20)]
    public string Tipo { get; set; }

    [Required(ErrorMessage = "A data é obrigatória")]
    public DateTime Data { get; set; }

    [Required(ErrorMessage = "A conta é obrigatória")]
    public int ContaId { get; set; }
}