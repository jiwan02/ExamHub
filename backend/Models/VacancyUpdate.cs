namespace Examhub.Models
{
    public class VacancyUpdate
    {
        public int Id { get; set; }
        public int VacancyId { get; set; }
        public string UpdateTopic { get; set; }
        public string ApplicationLink { get; set; } // Added as per your update
        public DateTime PostedDate { get; set; }
        public Vacancy Vacancy { get; set; } // Navigation property
        public List<VacancyUpdateImage> Images { get; set; }
    }
}
