namespace Examhub.Models
{
    public class Topic
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public List<StudyMaterial> StudyMaterials { get; set; }
    }
}