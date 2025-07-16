namespace Examhub.Models.DTOs
{
    public class TrackedVacancyDto
    {
        public int VacancyId { get; set; }
        public DateTime TrackedOn { get; set; }
        public VacancyDto VacancyDetails { get; set; }
    }
}
