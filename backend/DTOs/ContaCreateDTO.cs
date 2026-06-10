using System.ComponentModel.DataAnnotations;

namespace GestaoFinanceira.DTOs;

public class ContaCreateDTO
{
    [Required(ErrorMessage = "O nome da conta é obrigatório")]
    [StringLength(100, ErrorMessage = "O nome deve ter no máximo 100 caracteres")]
    public string Nome { get; set; }

    [Required(ErrorMessage = "O saldo é obrigatório")]
    public decimal Saldo { get; set; }

    [Required(ErrorMessage = "O usuário é obrigatório")]
    public int UsuarioId { get; set; }
}