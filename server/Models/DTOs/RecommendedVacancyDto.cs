namespace Examhub.Models.DTOs
{
    public class RecommendedVacancyDto
    {
        public int Id { get; set; }
        public string Topic { get; set; }
        public string Qualifications { get; set; }
        public string AgeRange { get; set; }
        public string RequiredQualificationStream { get; set; }
        public string ApplicationLink { get; set; }
        public DateTime PostedDate { get; set; }
        public DateTime? ExamDate { get; set; }
        public string PostedBy { get; set; }
        public List<string> ImagePaths { get; set; }
    }
}
