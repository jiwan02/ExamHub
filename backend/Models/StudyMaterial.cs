namespace Examhub.Models
{
    public class StudyMaterial
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string FilePath { get; set; } // Path to PDF
        public int? CategoryId { get; set; }
        public Category Category { get; set; }
        public int? TopicId { get; set; }
        public Topic Topic { get; set; }
        public DateTime UploadedDate { get; set; }
        public int UploadedById { get; set; }
        public User UploadedBy { get; set; }
    }
}