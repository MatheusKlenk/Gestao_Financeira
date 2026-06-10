using System.ComponentModel.DataAnnotations;

namespace GestaoFinanceira.DTOs;

public class LoginDTO
{
    [Required(ErrorMessage = "O email é obrigatório")]
    [EmailAddress(ErrorMessage = "Email inválido")]
    [StringLength(100)]
    public string Email { get; set; }

    [Required(ErrorMessage = "A senha é obrigatória")]
    [MinLength(6, ErrorMessage = "A senha deve ter no mínimo 6 caracteres")]
    [StringLength(100)]
    public string Senha { get; set; }
}