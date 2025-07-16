namespace Examhub.Models.DTOs
{
    public class CreateVacancyDto
    {
        public string Topic { get; set; }
        public string Qualifications { get; set; }
        public string AgeRange { get; set; }
        public string RequiredQualificationStream { get; set; }
        public string ApplicationLink { get; set; }
        public DateTime? ExamDate { get; set; }
        public List<IFormFile> Images { get; set; }
    }
}
