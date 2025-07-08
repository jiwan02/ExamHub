using System.ComponentModel.DataAnnotations.Schema;

namespace Examhub.Models
{
    public class Vacancy
    {
        public int Id { get; set; }
        public string Topic { get; set; }
        public string Qualifications { get; set; }
        public string AgeRange { get; set; }
        public string RequiredQualificationStream { get; set; }
        public string ApplicationLink { get; set; }
        public int PostedById { get; set; }
        public User PostedBy { get; set; }
        public DateTime PostedDate { get; set; }
        public DateTime? ExamDate { get; set; }
        public List<VacancyImage> Images { get; set; }
    }
}
