import React, { useState } from 'react';
import { userService } from '../../services/userService';
import VacancyCard from '../vacancy/VacancyCard';
import { Star, Calendar, Search, AlertCircle } from 'lucide-react';

const Recommendations = () => {
  const [vacancies, setVacancies] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const { data } = await userService.getRecommendations(params);
      setVacancies(data.vacancies);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (vacancyId) => {
    try {
      await userService.toggleTrackVacancy(vacancyId);
      setVacancies(vacancies.map((v) =>
        v.id === vacancyId ? { ...v, tracked: !v.tracked } : v
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to track/untrack vacancy');
    }
  };

  const handleRate = async (vacancyId, rating) => {
    try {
      await userService.rateVacancy({ vacancyId, rating });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to rate vacancy');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-amber-100 rounded-lg">
          <Star className="h-6 w-6 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Recommended Vacancies</h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Search Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filter by Exam Date Range</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="h-5 w-5" />
              <span>{loading ? 'Searching...' : 'Get Recommendations'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-6">
        {vacancies.map((vacancy) => (
          <VacancyCard
            key={vacancy.id}
            vacancy={vacancy}
            onTrack={handleTrack}
            onRate={handleRate}
          />
        ))}
      </div>

      {vacancies.length === 0 && !loading && (
        <div className="text-center py-12">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
          <p className="text-gray-600 mb-4">
            Click "Get Recommendations" to find vacancies tailored to your profile.
          </p>
          <p className="text-sm text-gray-500">
            Make sure your profile is complete for better recommendations.
          </p>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
