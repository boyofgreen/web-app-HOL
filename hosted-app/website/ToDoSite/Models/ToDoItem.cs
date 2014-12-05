namespace ToDoSite.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class ToDoItem
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        public string UserName { get; set; }

        [Required]
        public string Title { get; set; }

        public bool Completed { get; set; }
    }
}