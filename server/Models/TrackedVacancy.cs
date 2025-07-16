using System.ComponentModel.DataAnnotations.Schema;

namespace Examhub.Models
{
    public class TrackedVacancy
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int VacancyId { get; set; }
        public DateTime TrackedOn { get; set; }
        public User User { get; set; }
        public Vacancy Vacancy { get; set; }
    }
}
