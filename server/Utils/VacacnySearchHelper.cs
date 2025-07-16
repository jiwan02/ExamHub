using Examhub.Models;

namespace Examhub.Utils
{
        public static class VacancySearchHelper
        {
            public static List<Vacancy> BinarySearchByExamDate(List<Vacancy> vacancies, DateTime? startDate, DateTime? endDate)
            {
                if (vacancies == null || !vacancies.Any() || startDate == null || endDate == null)
                    return new List<Vacancy>();

                var sortedVacancies = vacancies
                    .Where(v => v.ExamDate.HasValue)
                    .OrderBy(v => v.ExamDate.Value)
                    .ToList();

                int left = 0;
                int right = sortedVacancies.Count - 1;
                int startIndex = -1;

                
                while (left <= right)
                {
                    int mid = left + (right - left) / 2;
                    if (sortedVacancies[mid].ExamDate.Value >= startDate.Value)
                    {
                        startIndex = mid;
                        right = mid - 1;
                    }
                    else
                    {
                        left = mid + 1;
                    }
                }

                if (startIndex == -1)
                    return new List<Vacancy>();

                
                var result = new List<Vacancy>();
                for (int i = startIndex; i < sortedVacancies.Count && sortedVacancies[i].ExamDate <= endDate; i++)
                {
                    result.Add(sortedVacancies[i]);
                }

                return result;
            }
        }
}
