namespace Examhub.Models
{
    public class VacancyImage
    {
        public int Id { get; set; }
        public int VacancyId { get; set; }
        public string ImagePath { get; set; }
        public string OriginalFileName { get; set; }
    }
}
