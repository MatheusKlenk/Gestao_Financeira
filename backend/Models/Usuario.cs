using System.ComponentModel.DataAnnotations;

namespace GestaoFinanceira.Models;

public class Usuario
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Nome { get; set; }

    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; }

    [Required]
    [MinLength(6)]
    [StringLength(100)]
    public string Senha { get; set; }
    
    [Required]
    [MinLength(6)]
    [StringLength(100)]
    public string Role { get; set; } = "USUARIO";
}