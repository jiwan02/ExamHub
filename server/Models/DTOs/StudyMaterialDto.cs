namespace Examhub.Models.DTOs
{
    public class StudyMaterialDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string FilePath { get; set; }
        public int? CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int? TopicId { get; set; }
        public string TopicName { get; set; }
        public DateTime UploadedDate { get; set; }
        public string UploadedBy { get; set; }
    }
}