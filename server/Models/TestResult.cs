namespace Examhub.Models
{
    public class TestResult
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int StudyMaterialId { get; set; }
        public StudyMaterial StudyMaterial { get; set; }
        public int Score { get; set; } 
        public int TotalQuestions { get; set; }
        public DateTime TakenDate { get; set; }
    }
}