namespace Examhub.Models.DTOs
{

    public class VacancyDto
    {
        public int Id { get; set; }
        public string Topic { get; set; }
        public DateTime PostedDate { get; set; }
        public string PostedBy { get; set; }
        public string ApplicationLink { get; set; }
    }
}
