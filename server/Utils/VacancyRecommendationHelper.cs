using Examhub.Data;
using Examhub.Models;
using Examhub.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Examhub.Utils
{
    public static class VacancyRecommendationHelper
    {
        private static readonly Dictionary<string, int> QualificationRank = new()
        {
            { "SEE", 1 }, { "+2", 2 }, { "Bachelor", 3 }, { "Master", 4 }
        };

        // ================== UTILITY METHODS ==================
        public static int CalculateAge(DateTime dateOfBirth)
        {
            var today = DateTime.Today;
            int age = today.Year - dateOfBirth.Year;
            if (dateOfBirth.Date > today.AddYears(-age)) age--;
            return age;
        }

        public static RecommendedVacancyDto CreateVacancyDto(Vacancy vacancy)
        {
            return new RecommendedVacancyDto
            {
                Id = vacancy.Id,
                Topic = vacancy.Topic,
                Qualifications = vacancy.Qualifications,
                AgeRange = vacancy.AgeRange,
                RequiredQualificationStream = vacancy.RequiredQualificationStream,
                ApplicationLink = vacancy.ApplicationLink,
                PostedDate = vacancy.PostedDate,
                ExamDate = vacancy.ExamDate,
                PostedBy = vacancy.PostedBy?.FullName,
                ImagePaths = vacancy.Images?.Select(img => img.ImagePath).ToList() ?? new List<string>()
            };
        }

        //  CONTENT-BASED FILTERING METHODS 
        public static bool IsQualificationMatch(string userQualification, string vacancyQualification)
        {
            if (string.IsNullOrEmpty(vacancyQualification))
                return true;

            if (!QualificationRank.TryGetValue(userQualification, out int userRank) ||
                !QualificationRank.TryGetValue(vacancyQualification, out int vacancyRank))
                return false;

            return userRank >= vacancyRank;
        }

        public static bool IsAgeInRange(int userAge, string ageRange)
        {
            if (string.IsNullOrEmpty(ageRange))
                return true;

            try
            {
                var parts = ageRange.Split('-');
                if (parts.Length == 2 &&
                    int.TryParse(parts[0].Trim(), out int minAge) &&
                    int.TryParse(parts[1].Trim(), out int maxAge))
                {
                    return userAge >= minAge && userAge <= maxAge;
                }

                if (int.TryParse(ageRange.Trim(), out int exactAge))
                {
                    return userAge == exactAge;
                }
            }
            catch
            {
                return false;
            }

            return false;
        }

        // ================== COLLABORATIVE FILTERING METHODS ==================
        private static double CalculateCosineSimilarity(Dictionary<int, int> user1Ratings, Dictionary<int, int> user2Ratings)
        {
            var commonVacancies = user1Ratings.Keys.Intersect(user2Ratings.Keys).ToList();
            if (!commonVacancies.Any())
                return 0.0;

            double dotProduct = 0.0, norm1 = 0.0, norm2 = 0.0;
            foreach (var vacancyId in commonVacancies)
            {
                dotProduct += user1Ratings[vacancyId] * user2Ratings[vacancyId];
                norm1 += Math.Pow(user1Ratings[vacancyId], 2);
                norm2 += Math.Pow(user2Ratings[vacancyId], 2);
            }

            norm1 = Math.Sqrt(norm1);
            norm2 = Math.Sqrt(norm2);
            return norm1 * norm2 == 0 ? 0.0 : dotProduct / (norm1 * norm2);
        }

        public static List<RecommendedVacancyDto> GetCollaborativeRecommendations(
            ApplicationDbContext context, int userId, List<Vacancy> allVacancies)
        {
            var userRatings = context.UserVacancyRatings
                .Where(r => r.UserId == userId)
                .ToList();

            if (!userRatings.Any())
                return new List<RecommendedVacancyDto>();

            var similarUsers = context.UserVacancyRatings
                .Where(r => r.UserId != userId)
                .ToList() // Materialize to avoid LINQ translation issue
                .GroupBy(r => r.UserId)
                .Select(g => new
                {
                    UserId = g.Key,
                    Similarity = CalculateCosineSimilarity(
                        userRatings.ToDictionary(r => r.VacancyId, r => r.Rating),
                        g.ToDictionary(r => r.VacancyId, r => r.Rating))
                })
                .OrderByDescending(s => s.Similarity)
                .Take(5)
                .ToList();

            var recommendedVacancyIds = new HashSet<int>();
            foreach (var similarUser in similarUsers)
            {
                var otherUserRatings = context.UserVacancyRatings
                    .Where(r => r.UserId == similarUser.UserId && r.Rating >= 3)
                    .Select(r => r.VacancyId)
                    .Except(userRatings.Select(r => r.VacancyId))
                    .ToList();

                recommendedVacancyIds.UnionWith(otherUserRatings);
            }

            var recommendations = allVacancies
                .Where(v => recommendedVacancyIds.Contains(v.Id))
                .Select(CreateVacancyDto)
                .ToList();

            return recommendations;
        }

        // ================== COMBINED RECOMMENDATION METHOD ==================
        public static async Task<List<RecommendedVacancyDto>> CalculateRecommendations(
            ApplicationDbContext context, int userId)
        {
            // Get user profile for content-based filtering
            var user = await context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return new List<RecommendedVacancyDto>();

            // Get all vacancies for content-based filtering
            var allVacancies = await context.Vacancies
                .Include(v => v.Images)
                .Include(v => v.PostedBy)
                .ToListAsync();

            // Collaborative filtering
            var userRatings = await context.UserVacancyRatings
                .Where(r => r.UserId == userId)
                .ToListAsync();

            var collaborativeRecommendations = new List<RecommendedVacancyDto>();
            if (userRatings.Any())
            {
                var otherUsersRatings = await context.UserVacancyRatings
                    .Where(r => r.UserId != userId)
                    .ToListAsync(); // Materialize early to avoid LINQ translation issue

                var similarities = otherUsersRatings
                    .GroupBy(r => r.UserId)
                    .Select(g => new
                    {
                        UserId = g.Key,
                        Similarity = CalculateCosineSimilarity(
                            userRatings.ToDictionary(r => r.VacancyId, r => r.Rating),
                            g.ToDictionary(r => r.VacancyId, r => r.Rating))
                    })
                    .Where(s => s.Similarity > 0)
                    .OrderByDescending(s => s.Similarity)
                    .Take(5)
                    .ToList();

                var similarUserIds = similarities.Select(s => s.UserId).ToList();

                var collaborativeVacancyIds = otherUsersRatings
                    .Where(r => similarUserIds.Contains(r.UserId) && r.Rating >= 4
                                && !userRatings.Select(ur => ur.VacancyId).Contains(r.VacancyId))
                    .Select(r => r.VacancyId)
                    .Distinct()
                    .ToList();

                collaborativeRecommendations = allVacancies
                    .Where(v => collaborativeVacancyIds.Contains(v.Id))
                    .Select(CreateVacancyDto)
                    .ToList();
            }

            // Content-based filtering
            var contentRecommendations = new List<RecommendedVacancyDto>();
            if (user.DateOfBirth.HasValue && !string.IsNullOrEmpty(user.MinimumQualification))
            {
                int userAge = CalculateAge(user.DateOfBirth.Value);
                string userQualification = user.MinimumQualification;

                contentRecommendations = allVacancies
                    .Where(v => IsQualificationMatch(userQualification, v.Qualifications) &&
                                IsAgeInRange(userAge, v.AgeRange) &&
                                !userRatings.Select(r => r.VacancyId).Contains(v.Id))
                    .Select(CreateVacancyDto)
                    .ToList();
            }

            // Combine and deduplicate recommendations
            var finalRecommendations = collaborativeRecommendations
                .Concat(contentRecommendations)
                .GroupBy(v => v.Id)
                .Select(g => g.First())
                .OrderByDescending(v => v.PostedDate)
                .Take(10)
                .ToList();

            return finalRecommendations;
        }
    }
}