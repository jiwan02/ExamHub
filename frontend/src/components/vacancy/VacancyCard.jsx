import React, { useState } from 'react';
import { Calendar, Users, GraduationCap, ExternalLink, Star, Bookmark, BookmarkCheck } from 'lucide-react';

const VacancyCard = ({ vacancy, onTrack, onRate }) => {
  const [rating, setRating] = useState(0);
  const [isRating, setIsRating] = useState(false);

  const handleRate = async () => {
    if (rating === 0) return;
    setIsRating(true);
    try {
      await onRate(vacancy.id, rating);
      alert('Vacancy rated successfully!');
      setRating(0);
    } catch (err) {
      alert('Failed to rate vacancy');
    } finally {
      setIsRating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex-1">{vacancy.topic}</h3>
        <button
          onClick={() => onTrack(vacancy.id)}
          className={`p-2 rounded-lg transition-colors ${
            vacancy.tracked 
              ? 'bg-green-100 text-green-600 hover:bg-green-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {vacancy.tracked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
        </button>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span className="text-sm">Posted: {new Date(vacancy.postedDate).toLocaleDateString()}</span>
        </div>

        {vacancy.examDate && (
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">Exam Date: {new Date(vacancy.examDate).toLocaleDateString()}</span>
          </div>
        )}

        <div className="flex items-center text-gray-600">
          <GraduationCap className="h-4 w-4 mr-2" />
          <span className="text-sm">Qualifications: {vacancy.qualifications}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Users className="h-4 w-4 mr-2" />
          <span className="text-sm">Age Range: {vacancy.ageRange}</span>
        </div>

        {vacancy.requiredQualificationStream && (
          <div className="flex items-center text-gray-600">
            <GraduationCap className="h-4 w-4 mr-2" />
            <span className="text-sm">Stream: {vacancy.requiredQualificationStream}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <a
          href={vacancy.applicationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <ExternalLink className="h-4 w-4" />
          <span>Apply Now</span>
        </a>

        <div className="flex items-center space-x-2">
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="0">Rate (1–5)</option>
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>
                {n} Star{n > 1 ? 's' : ''}
              </option>
            ))}
          </select>

          <button
            onClick={handleRate}
            disabled={rating === 0 || isRating}
            className="flex items-center space-x-1 bg-amber-500 text-white px-3 py-2 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Star className="h-4 w-4" />
            <span>{isRating ? 'Rating...' : 'Rate'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VacancyCard;
