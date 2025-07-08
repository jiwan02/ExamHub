using Examhub.Data;
using Examhub.Models;
using Examhub.Models.DTOs;
using Examhub.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Examhub.Controllers
{
    [Route("api/user")]
    [ApiController]
    [Authorize]
    public class UserstudyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;

        public UserstudyController(ApplicationDbContext context, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
        }

        private int GetLoggedInUserId() => int.Parse(User.FindFirst("UserId")?.Value ?? "0");

        // New Endpoints
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories
                .Select(c => new CategoryDto { Id = c.Id, Name = c.Name })
                .ToListAsync();
            return Ok(categories);
        }

        [HttpGet("categories/{categoryId}/topics")]
        public async Task<IActionResult> GetTopics(int categoryId)
        {
            if (!await _context.Categories.AnyAsync(c => c.Id == categoryId))
                return NotFound("Category not found.");

            var topics = await _context.Topics
                .Where(t => t.CategoryId == categoryId)
                .Select(t => new TopicDto { Id = t.Id, Name = t.Name, CategoryId = t.CategoryId })
                .ToListAsync();
            return Ok(topics);
        }

        [HttpGet("study-materials")]
        public async Task<IActionResult> GetStudyMaterials([FromQuery] int? categoryId, [FromQuery] int? topicId)
        {
            var query = _context.StudyMaterials
                .Include(m => m.Category)
                .Include(m => m.Topic)
                .Include(m => m.UploadedBy)
                .AsQueryable();

            if (categoryId.HasValue)
                query = query.Where(m => m.CategoryId == categoryId);
            if (topicId.HasValue)
                query = query.Where(m => m.TopicId == topicId);

            var materials = await query
                .Select(m => new StudyMaterialDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    FilePath = m.FilePath,
                    CategoryId = m.CategoryId,
                    CategoryName = m.Category.Name,
                    TopicId = m.TopicId,
                    TopicName = m.Topic.Name,
                    UploadedDate = m.UploadedDate,
                    UploadedBy = m.UploadedBy.FullName
                })
                .ToListAsync();

            return Ok(materials);
        }

        [HttpGet("study-materials/{id}/download")]
        public async Task<IActionResult> DownloadStudyMaterial(int id)
        {
            var material = await _context.StudyMaterials.FindAsync(id);
            if (material == null) return NotFound("Study material not found.");

            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", material.FilePath.TrimStart('/'));
            if (!System.IO.File.Exists(fullPath))
                return NotFound("File not found on server.");

            var fileBytes = await System.IO.File.ReadAllBytesAsync(fullPath);
            return File(fileBytes, "application/pdf", Path.GetFileName(fullPath));
        }

        [HttpGet("study-materials/{id}/test")]
        public async Task<IActionResult> GenerateTest(int id)
        {
            var material = await _context.StudyMaterials.FindAsync(id);
            if (material == null) return NotFound("Study material not found.");

            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", material.FilePath.TrimStart('/'));
            if (!System.IO.File.Exists(fullPath))
                return NotFound("File not found on server.");

            try
            {
                var client = _httpClientFactory.CreateClient();
                var request = new
                {
                    PdfPath = fullPath,
                    NumberOfQuestions = 10
                };

                var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");
                var response = await client.PostAsync("http://localhost:5000/generate-mcq", content);
                response.EnsureSuccessStatusCode();

                var questions = await response.Content.ReadFromJsonAsync<List<TestQuestionDto>>();
                return Ok(questions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to generate test", details = ex.Message });
            }
        }

        [HttpPost("study-materials/test/submit")]
        public async Task<IActionResult> SubmitTest([FromBody] TestSubmissionDto submission)
        {
            var material = await _context.StudyMaterials.FindAsync(submission.StudyMaterialId);
            if (material == null) return NotFound("Study material not found.");

            try
            {
                var client = _httpClientFactory.CreateClient();
                var response = await client.PostAsync(
                    "http://localhost:5000/evaluate-mcq",
                    new StringContent(JsonSerializer.Serialize(submission), Encoding.UTF8, "application/json"));
                response.EnsureSuccessStatusCode();

                var result = await response.Content.ReadFromJsonAsync<Dictionary<string, int>>();
                var score = result["score"];
                var total = result["total"];

                var testResult = new TestResult
                {
                    UserId = GetLoggedInUserId(),
                    StudyMaterialId = submission.StudyMaterialId,
                    Score = score,
                    TotalQuestions = total,
                    TakenDate = DateTime.UtcNow
                };

                _context.TestResults.Add(testResult);
                await _context.SaveChangesAsync();

                return Ok(new { Score = score, TotalQuestions = total });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to evaluate test", details = ex.Message });
            }
        }
    }
}