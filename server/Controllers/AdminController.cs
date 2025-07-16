using Examhub.Data;
using Examhub.Models;
using Examhub.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Examhub.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "Admin")] 
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Categories
        [HttpPost("categories")]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryDto dto)
        {
            var category = new Category { Name = dto.Name };
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return Ok(new CategoryDto { Id = category.Id, Name = category.Name });
        }

        [HttpDelete("categories/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound("Category not found.");

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // Topics
        [HttpPost("topics")]
        public async Task<IActionResult> CreateTopic([FromBody] TopicDto dto)
        {
            if (!await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId))
                return BadRequest("Invalid CategoryId.");

            var topic = new Topic { Name = dto.Name, CategoryId = dto.CategoryId };
            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();
            return Ok(new TopicDto { Id = topic.Id, Name = topic.Name, CategoryId = topic.CategoryId });
        }

        [HttpDelete("topics/{id}")]
        public async Task<IActionResult> DeleteTopic(int id)
        {
            var topic = await _context.Topics.FindAsync(id);
            if (topic == null) return NotFound("Topic not found.");

            _context.Topics.Remove(topic);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // Study Materials (PDFs)
        [HttpPost("study-materials")]
        public async Task<IActionResult> UploadStudyMaterial([FromForm] string title, int? categoryId, int? topicId, IFormFile file)
        {
            if (file == null || !file.FileName.EndsWith(".pdf"))
                return BadRequest("Invalid file. Only PDFs are allowed.");

            if (!categoryId.HasValue && !topicId.HasValue)
                return BadRequest("Either CategoryId or TopicId must be provided.");

            if (categoryId.HasValue && !await _context.Categories.AnyAsync(c => c.Id == categoryId))
                return BadRequest("Invalid CategoryId.");

            if (topicId.HasValue && !await _context.Topics.AnyAsync(t => t.Id == topicId))
                return BadRequest("Invalid TopicId.");

            var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
            if (!Directory.Exists(uploadsDir))
                Directory.CreateDirectory(uploadsDir);

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsDir, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var material = new StudyMaterial
            {
                Title = title,
                FilePath = $"/uploads/{fileName}",
                CategoryId = categoryId,
                TopicId = topicId,
                UploadedDate = DateTime.UtcNow,
                UploadedById = int.Parse(User.FindFirst("UserId")?.Value ?? "0")
            };

            _context.StudyMaterials.Add(material);
            await _context.SaveChangesAsync();

            return Ok(new StudyMaterialDto
            {
                Id = material.Id,
                Title = material.Title,
                FilePath = material.FilePath,
                CategoryId = material.CategoryId,
                CategoryName = material.Category?.Name,
                TopicId = material.TopicId,
                TopicName = material.Topic?.Name,
                UploadedDate = material.UploadedDate,
                UploadedBy = material.UploadedBy?.FullName
            });
        }

        [HttpDelete("study-materials/{id}")]
        public async Task<IActionResult> DeleteStudyMaterial(int id)
        {
            var material = await _context.StudyMaterials.FindAsync(id);
            if (material == null) return NotFound("Study material not found.");

            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", material.FilePath.TrimStart('/'));
            if (System.IO.File.Exists(fullPath))
                System.IO.File.Delete(fullPath);

            _context.StudyMaterials.Remove(material);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}