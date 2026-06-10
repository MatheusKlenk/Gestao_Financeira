using System.ComponentModel.DataAnnotations;

namespace GestaoFinanceira.DTOs;

public class UsuarioUpdateDTO
{
    [Required(ErrorMessage = "O nome é obrigatório")]
    [StringLength(100)]
    public string Nome { get; set; }

    [Required(ErrorMessage = "O email é obrigatório")]
    [EmailAddress(ErrorMessage = "Email inválido")]
    [StringLength(100)]
    public string Email { get; set; }

    // Senha opcional na edição — deixar em branco para não alterar
    [StringLength(100)]
    public string? Senha { get; set; }

    public string Role { get; set; } = "USUARIO";
}
