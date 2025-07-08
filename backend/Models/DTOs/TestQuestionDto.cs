namespace Examhub.Models.DTOs
{
    public class TestQuestionDto
    {
        public string Question { get; set; }
        public List<string> Options { get; set; }
        public int CorrectOptionIndex { get; set; }
    }
}