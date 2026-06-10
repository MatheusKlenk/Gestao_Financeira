using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestaoFinanceira.Models;

public class Conta
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Nome { get; set; }

    public decimal Saldo { get; set; }

    [ForeignKey("Usuario")]
    public int UsuarioId { get; set; }

    public Usuario? Usuario { get; set; }
}