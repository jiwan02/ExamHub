namespace Examhub.Models
{
    public class VacancyUpdateImage
    {
        public int Id { get; set; }
        public int VacancyUpdateId { get; set; }
        public string ImagePath { get; set; }
        public string OriginalFileName { get; set; }
    }
}
