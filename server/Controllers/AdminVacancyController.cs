using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Linq;
using System.Threading.Tasks;
using Examhub.Data;
using Examhub.Hubs;
using Examhub.Models.DTOs;
using Examhub.Models;
using Examhub.Utils;

namespace Examhub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminVacancyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly IHubContext<NotificationHub> _hubContext;

        public AdminVacancyController(ApplicationDbContext context, IWebHostEnvironment environment, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _environment = environment;
            _hubContext = hubContext;
        }

        [HttpPost]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> PostVacancy([FromForm] CreateVacancyDto vacancyDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var userId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");
                var vacancy = new Vacancy
                {
                    Topic = vacancyDto.Topic,
                    Qualifications = vacancyDto.Qualifications,
                    AgeRange = vacancyDto.AgeRange,
                    RequiredQualificationStream = vacancyDto.RequiredQualificationStream,
                    ApplicationLink = vacancyDto.ApplicationLink,
                    PostedById = userId,
                    PostedDate = DateTime.UtcNow,
                    ExamDate = vacancyDto.ExamDate
                };

                _context.Vacancies.Add(vacancy);
                await _context.SaveChangesAsync();

                if (vacancyDto.Images != null && vacancyDto.Images.Any())
                {
                    var uploadResults = await ImageUploadHelper.UploadImagesAsync(
                        _environment,
                        vacancyDto.Images,
                        "vacancies");

                    if (uploadResults.Any())
                    {
                        var imageList = uploadResults.Select(result => new VacancyImage
                        {
                            VacancyId = vacancy.Id,
                            ImagePath = result.FilePath,
                            OriginalFileName = result.OriginalFileName
                        }).ToList();

                        _context.VacancyImages.AddRange(imageList);
                        await _context.SaveChangesAsync();
                    }
                }

                await _hubContext.Clients.All.SendAsync("ReceiveNotification", $"New vacancy posted: {vacancy.Topic}");
                return Ok(new { message = "Vacancy posted successfully", vacancyId = vacancy.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while posting vacancy", details = ex.Message });
            }
        }

        [HttpGet("manage")]
        public async Task<IActionResult> ManageVacancies()
        {
            try
            {
                var userId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");
                var vacancies = await _context.Vacancies
                    .Include(v => v.Images)
                    .Where(v => v.PostedById == userId)
                    .OrderByDescending(v => v.PostedDate)
                    .Select(v => new
                    {
                        v.Id,
                        v.Topic,
                        v.Qualifications,
                        v.AgeRange,
                        v.RequiredQualificationStream,
                        v.ApplicationLink,
                        v.PostedDate,
                        v.ExamDate,
                        ImageCount = v.Images.Count
                    })
                    .ToListAsync();

                return Ok(vacancies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while retrieving vacancies", details = ex.Message });
            }
        }

        [HttpGet("all-users")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _context.Users
                    .Select(u => new
                    {
                        u.Id,
                        u.FullName,
                        u.Email
                    })
                    .ToListAsync();

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while retrieving users", details = ex.Message });
            }
        }

        [HttpGet("tracked-users")]
        public async Task<IActionResult> GetTrackedVacancies()
        {
            try
            {
                var trackedData = await _context.TrackedVacancies
                    .Include(tv => tv.User)
                    .Include(tv => tv.Vacancy)
                    .Select(tv => new
                    {
                        UserId = tv.UserId,
                        UserName = tv.User.FullName,
                        Email = tv.User.Email,
                        VacancyId = tv.VacancyId,
                        VacancyTopic = tv.Vacancy.Topic,
                        TrackedOn = tv.TrackedOn
                    })
                    .ToListAsync();

                return Ok(trackedData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while retrieving tracked vacancies", details = ex.Message });
            }
        }

        [HttpPost("post-vacancy-update")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> PostVacancyUpdate([FromForm] VacancyUpdateDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var vacancy = await _context.Vacancies.FindAsync(updateDto.VacancyId);
                if (vacancy == null)
                    return NotFound("Vacancy not found");

                var update = new VacancyUpdate
                {
                    VacancyId = updateDto.VacancyId,
                    UpdateTopic = updateDto.UpdateTopic,
                    ApplicationLink = updateDto.ApplicationLink,
                    PostedDate = DateTime.UtcNow
                };

                _context.VacancyUpdates.Add(update);
                await _context.SaveChangesAsync();

                if (updateDto.Images != null && updateDto.Images.Any())
                {
                    var uploadResults = await ImageUploadHelper.UploadImagesAsync(
                        _environment,
                        updateDto.Images,
                        "vacancyupdates");

                    if (uploadResults.Any())
                    {
                        var imageList = uploadResults.Select(result => new VacancyUpdateImage
                        {
                            VacancyUpdateId = update.Id,
                            ImagePath = result.FilePath,
                            OriginalFileName = result.OriginalFileName
                        }).ToList();

                        _context.VacancyUpdateImages.AddRange(imageList);
                        await _context.SaveChangesAsync();
                    }
                }

                // Send email notifications to users who tracked this vacancy
                var trackedUsers = await _context.TrackedVacancies
                    .Where(tv => tv.VacancyId == updateDto.VacancyId)
                    .Include(tv => tv.User)
                    .Select(tv => tv.User.Email)
                    .Distinct()
                    .ToListAsync();

                foreach (var email in trackedUsers)
                {
                    await EmailSender.SendAsync(
                        email,
                        $"Update on Vacancy: {vacancy.Topic}",
                        $"New Update: {updateDto.UpdateTopic}");
                }

                await _hubContext.Clients.All.SendAsync("ReceiveNotification", $"Vacancy updated: {vacancy.Topic}");
                return Ok(new { message = "Update posted and notifications sent successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while posting update", details = ex.Message });
            }
        }
    }
}