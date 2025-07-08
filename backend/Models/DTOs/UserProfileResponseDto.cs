namespace Examhub.Models.DTOs
{
    public class UserProfileResponseDto
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; }
        public string MinimumQualification { get; set; }
        public string QualificationStream { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public int? Age { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
