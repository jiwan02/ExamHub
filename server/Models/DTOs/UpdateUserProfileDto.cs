namespace Examhub.Models.DTOs
{
    public class UpdateUserProfileDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; }
        public string MinimumQualification { get; set; }
        public string QualificationStream { get; set; }
        public DateTime? DateOfBirth { get; set; }
    }
}
