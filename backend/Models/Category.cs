namespace Examhub.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } // e.g., Engineering, Doctor
        public List<Topic> Topics { get; set; }
        public List<StudyMaterial> StudyMaterials { get; set; }
    }
}