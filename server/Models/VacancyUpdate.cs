namespace Examhub.Models
{
    public class VacancyUpdate
    {
        public int Id { get; set; }
        public int VacancyId { get; set; }
        public string UpdateTopic { get; set; }
        public string ApplicationLink { get; set; } 
        public DateTime PostedDate { get; set; }
        public Vacancy Vacancy { get; set; } 
        public List<VacancyUpdateImage> Images { get; set; }
    }
}
