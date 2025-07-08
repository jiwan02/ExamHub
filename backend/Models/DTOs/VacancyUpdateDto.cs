namespace Examhub.Models.DTOs
{
  public class VacancyUpdateDto
    {
        public int VacancyId { get; set; }
        public string UpdateTopic { get; set; }
        public string ApplicationLink { get; set; }
        public List<IFormFile> Images { get; set; }
    }
}
