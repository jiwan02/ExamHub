using System.ComponentModel.DataAnnotations.Schema;

namespace Examhub.Models
{
    public class UserVacancyRating
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int VacancyId { get; set; }
        public int Rating { get; set; } 
        public User User { get; set; }
        public Vacancy Vacancy { get; set; }
    }
}
