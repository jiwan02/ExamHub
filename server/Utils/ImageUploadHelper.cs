using Examhub.Models.DTOs;

namespace Examhub.Utils
{
       
        public static class ImageUploadHelper
        {
            public static async Task<List<ImageUploadResultdto>> UploadImagesAsync(
                IWebHostEnvironment environment,
                IEnumerable<IFormFile> images,
                string subFolder,
                int maxFileSize = 5 * 1024 * 1024,
                string[] allowedExtensions = null)
            {
                if (allowedExtensions == null)
                {
                    allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp" };
                }

                var results = new List<ImageUploadResultdto>();

                if (images == null || !images.Any())
                {
                    return results;
                }

                var uploadPath = Path.Combine(environment.WebRootPath, "uploads", subFolder);
                Directory.CreateDirectory(uploadPath);

                foreach (var image in images)
                {
                    if (image == null || image.Length == 0 || image.Length > maxFileSize)
                        continue;

                    var extension = Path.GetExtension(image.FileName)?.ToLowerInvariant();
                    if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension))
                        continue;

                    var fileName = $"{Guid.NewGuid()}{extension}";
                    var filePath = Path.Combine(uploadPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }

                    results.Add(new ImageUploadResultdto
                    {
                        FileName = fileName,
                        OriginalFileName = image.FileName,
                        FilePath = $"/uploads/{subFolder}/{fileName}"
                    });
                }

                return results;
            }
        }
}
