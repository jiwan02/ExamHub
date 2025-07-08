import api from './api';

export const userService = {
  getProfile: () => api.get('/User/profile'),

  updateProfile: (data) => api.put('/User/profile', data),

  getRecommendations: (params) =>
    api.get('/User/recommendations', { params }),

  rateVacancy: (data) =>
    api.post('/User/rate-vacancy', data),

  getAllVacancies: (params) =>
    api.get('/User/all-vacancies', { params }),

  toggleTrackVacancy: (vacancyId) =>
    api.post(`/User/track/${vacancyId}`),

  getTrackedVacancies: () =>
    api.get('/User/tracked-vacancies'),
};
