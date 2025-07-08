import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import VacancyCard from './VacancyCard';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

const VacancyList = () => {
  const [vacancies, setVacancies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVacancies();
  }, [page]);

  const fetchVacancies = async () => {
    setLoading(true);
    try {
      const { data } = await userService.getAllVacancies({ page, pageSize: 10 });
      setVacancies(data.items);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vacancies');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (vacancyId) => {
    try {
      await userService.toggleTrackVacancy(vacancyId);
      setVacancies(vacancies.map(v => 
        v.id === vacancyId ? { ...v, tracked: !v.tracked } : v
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to track/untrack vacancy');
    }
  };

  const handleRate = async (vacancyId, rating) => {
    await userService.rateVacancy({ vacancyId, rating });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">All Vacancies & Updates</h2>
        <p className="text-gray-600">Page {page} of {totalPages}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="space-y-6">
        {vacancies.map(vacancy => (
          <VacancyCard
            key={vacancy.id}
            vacancy={vacancy}
            onTrack={handleTrack}
            onRate={handleRate}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>
          
          <span className="text-gray-600 font-medium">
            Page {page} of {totalPages}
          </span>
          
          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VacancyList;
