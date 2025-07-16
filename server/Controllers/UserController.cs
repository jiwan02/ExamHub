using Examhub.Data;
using Examhub.Models;
using Examhub.Models.DTOs;
using Examhub.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Examhub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("profile")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                    return NotFound(new { message = "User not found" });

                var userProfile = new UserProfileResponseDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    Gender = user.Gender,
                    MinimumQualification = user.MinimumQualification,
                    QualificationStream = user.QualificationStream,
                    DateOfBirth = user.DateOfBirth,
                    Age = user.DateOfBirth.HasValue ? VacancyRecommendationHelper.CalculateAge(user.DateOfBirth.Value) : null,
                    CreatedDate = user.CreatedDate,
                    UpdatedDate = user.UpdatedDate
                };

                return Ok(userProfile);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while retrieving profile", details = ex.Message });
            }
        }

        [HttpPut("profile")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserProfileDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var userId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                    return NotFound(new { message = "User not found" });

                if (await _context.Users.AnyAsync(u => u.Email == updateDto.Email && u.Id != userId))
                    return BadRequest(new { message = "Email is already taken by another user" });

                user.FullName = updateDto.FullName;
                user.Email = updateDto.Email;
                user.Gender = updateDto.Gender;
                user.MinimumQualification = updateDto.MinimumQualification;
                user.QualificationStream = updateDto.QualificationStream;
                user.DateOfBirth = updateDto.DateOfBirth;
                user.UpdatedDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Profile updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while updating profile", details = ex.Message });
            }
        }

        [HttpGet("recommendations")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetRecommendedVacancies([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            try
            {
                var userId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                    return NotFound(new { message = "User not found" });

                if (user.DateOfBirth == null || string.IsNullOrEmpty(user.MinimumQualification))
                    return BadRequest(new { message = "Please update your date of birth and qualification details." });

                int userAge = VacancyRecommendationHelper.CalculateAge(user.DateOfBirth.Value);
                var allVacancies = await _context.Vacancies
                    .Include(v => v.Images)
                    .Include(v => v.PostedBy)
                    .ToListAsync();

                // Apply binary search if date range is provided
                var filteredVacancies = (startDate.HasValue && endDate.HasValue)
                    ? VacancySearchHelper.BinarySearchByExamDate(allVacancies, startDate, endDate)
                    : allVacancies;

                // Combine content-based and collaborative filtering
                var contentBasedVacancies = filteredVacancies
                    .Where(v =>
                        VacancyRecommendationHelper.IsAgeInRange(userAge, v.AgeRange) &&
                        VacancyRecommendationHelper.IsQualificationMatch(user.MinimumQualification, v.Qualifications) &&
                        (string.IsNullOrEmpty(v.RequiredQualificationStream) ||
                         v.RequiredQualificationStream.Equals("All", StringComparison.OrdinalIgnoreCase) ||
                         user.QualificationStream == v.RequiredQualificationStream))
                    .Select(VacancyRecommendationHelper.CreateVacancyDto)
                    .ToList();

                var collaborativeVacancies = VacancyRecommendationHelper.GetCollaborativeRecommendations(_context, userId, filteredVacancies);

                // Combine and remove duplicates
                var recommendedVacancies = contentBasedVacancies
                    .Union(collaborativeVacancies, new VacancyDtoEqualityComparer())
                    .ToList();

                return Ok(new
                {
                    message = $"Found {recommendedVacancies.Count} recommended vacancies",
                    userAge,
                    userQualification = user.MinimumQualification,
                    userStream = user.QualificationStream,
                    vacancies = recommendedVacancies
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while getting recommendations", details = ex.Message });
            }
        }

        [HttpPost("rate-vacancy")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> RateVacancy([FromBody] RateVacancyDto rateDto)
        {
            if (rateDto.Rating < 1 || rateDto.Rating > 5)
                return BadRequest(new { message = "Rating must be between 1 and 5" });

            try
            {
                var userId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");
                var existingRating = await _context.UserVacancyRatings
                    .FirstOrDefaultAsync(r => r.UserId == userId && r.VacancyId == rateDto.VacancyId);

                if (existingRating != null)
                {
                    existingRating.Rating = rateDto.Rating;
                }
                else
                {
                    _context.UserVacancyRatings.Add(new UserVacancyRating
                    {
                        UserId = userId,
                        VacancyId = rateDto.VacancyId,
                        Rating = rateDto.Rating
                    });
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Vacancy rated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while rating vacancy", details = ex.Message });
            }
        }

        [HttpGet("all-vacancies")]
        public async Task<IActionResult> GetAllVacancies([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var allVacancies = await _context.Vacancies
                    .Include(v => v.Images)
                    .Include(v => v.PostedBy)
                    .Select(v => new
                    {
                        ItemType = "Vacancy",
                        Id = v.Id,
                        Topic = v.Topic,
                        Qualifications = v.Qualifications,
                        AgeRange = v.AgeRange,
                        RequiredQualificationStream = v.RequiredQualificationStream,
                        ApplicationLink = v.ApplicationLink,
                        PostedDate = v.PostedDate,
                        ExamDate = v.ExamDate,
                        PostedBy = v.PostedBy.FullName,
                        ImagePaths = v.Images.Select(img => img.ImagePath).ToList(),
                        VacancyId = (int?)null
                    })
                    .ToListAsync();

                var allUpdates = await _context.VacancyUpdates
                    .Include(vu => vu.Images)
                    .Select(vu => new
                    {
                        ItemType = "Update",
                        Id = vu.Id,
                        Topic = vu.UpdateTopic,
                        Qualifications = (string)null,
                        AgeRange = (string)null,
                        RequiredQualificationStream = (string)null,
                        ApplicationLink = vu.ApplicationLink,
                        PostedDate = vu.PostedDate,
                        ExamDate = (DateTime?)null,
                        PostedBy = (string)null,
                        ImagePaths = vu.Images.Select(img => img.ImagePath).ToList(),
                        VacancyId = (int?)vu.VacancyId
                    })
                    .ToListAsync();

                var combinedItems = allVacancies
                    .Concat(allUpdates)
                    .OrderByDescending(x => x.PostedDate)
                    .ToList();

                var totalItems = combinedItems.Count;
                var pagedItems = combinedItems
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                return Ok(new
                {
                    totalItems,
                    currentPage = page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalItems / pageSize),
                    items = pagedItems
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while retrieving vacancies and updates", details = ex.Message });
            }
        }

        [HttpPost("track/{vacancyId}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> ToggleTrackVacancy(int vacancyId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");
                var trackedVacancy = await _context.TrackedVacancies
                    .FirstOrDefaultAsync(tv => tv.UserId == userId && tv.VacancyId == vacancyId);

                if (trackedVacancy != null)
                {
                    _context.TrackedVacancies.Remove(trackedVacancy);
                    await _context.SaveChangesAsync();
                    return Ok("Vacancy untracked successfully.");
                }
                else
                {
                    _context.TrackedVacancies.Add(new TrackedVacancy
                    {
                        UserId = userId,
                        VacancyId = vacancyId,
                        TrackedOn = DateTime.UtcNow
                    });
                    await _context.SaveChangesAsync();
                    return Ok("Vacancy tracked successfully.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while tracking/untracking vacancy", details = ex.Message });
            }
        }

        [HttpGet("tracked-vacancies")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetTrackedVacancies()
        {
            try
            {
                var userId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");
                var trackedVacancies = await _context.TrackedVacancies
                    .Where(tv => tv.UserId == userId)
                    .Include(tv => tv.Vacancy)
                    .ThenInclude(v => v.PostedBy)
                    .OrderByDescending(tv => tv.TrackedOn)
                    .Select(tv => new TrackedVacancyDto
                    {
                        VacancyId = tv.VacancyId,
                        TrackedOn = tv.TrackedOn,
                        VacancyDetails = new VacancyDto
                        {
                            Id = tv.Vacancy.Id,
                            Topic = tv.Vacancy.Topic,
                            PostedDate = tv.Vacancy.PostedDate,
                            PostedBy = tv.Vacancy.PostedBy.FullName,
                            ApplicationLink = tv.Vacancy.ApplicationLink
                        }
                    })
                    .ToListAsync();

                return Ok(trackedVacancies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while retrieving tracked vacancies", details = ex.Message });
            }
        }
    }

    public class VacancyDtoEqualityComparer : IEqualityComparer<RecommendedVacancyDto>
    {
        public bool Equals(RecommendedVacancyDto x, RecommendedVacancyDto y)
        {
            return x.Id == y.Id;
        }

        public int GetHashCode(RecommendedVacancyDto obj)
        {
            return obj.Id.GetHashCode();
        }
    }
}