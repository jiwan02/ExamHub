import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { Bookmark, Calendar, ExternalLink, AlertCircle } from 'lucide-react';

const TrackedVacancies = () => {
  const [trackedVacancies, setTrackedVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrackedVacancies();
  }, []);

  const fetchTrackedVacancies = async () => {
    try {
      const { data } = await userService.getTrackedVacancies();
      setTrackedVacancies(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tracked vacancies');
    } finally {
      setLoading(false);
    }
  };

  const handleUntrack = async (vacancyId) => {
    try {
      await userService.toggleTrackVacancy(vacancyId);
      setTrackedVacancies(trackedVacancies.filter(tv => tv.vacancyId !== vacancyId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to untrack vacancy');
    }
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
      <div className="flex items-center space-x-3">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
          <Bookmark className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Tracked Vacancies</h2>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          {trackedVacancies.length} Tracked
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="space-y-6">
        {trackedVacancies.map((tracked) => (
          <div
            key={tracked.vacancyId}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">{tracked.vacancyDetails.topic}</h3>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Tracking
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">
                  Posted: {new Date(tracked.vacancyDetails.postedDate).toLocaleDateString()}
                </span>
              </div>

              {tracked.vacancyDetails.examDate && (
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    Exam Date: {new Date(tracked.vacancyDetails.examDate).toLocaleDateString()}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Qualifications:</span>{' '}
                  {tracked.vacancyDetails.qualifications}
                </div>
                <div>
                  <span className="font-medium">Age Range:</span>{' '}
                  {tracked.vacancyDetails.ageRange}
                </div>
                <div className="sm:col-span-2">
                  <span className="font-medium">Required Stream:</span>{' '}
                  {tracked.vacancyDetails.requiredQualificationStream}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <a
                href={tracked.vacancyDetails.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Apply Now</span>
              </a>

              <button
                onClick={() => handleUntrack(tracked.vacancyId)}
                className="flex items-center justify-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <Bookmark className="h-4 w-4" />
                <span>Untrack</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {trackedVacancies.length === 0 && (
        <div className="text-center py-12">
          <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tracked vacancies</h3>
          <p className="text-gray-600">
            Start tracking vacancies you're interested in to keep them organized and get updates.
          </p>
        </div>
      )}
    </div>
  );
};

export default TrackedVacancies;
