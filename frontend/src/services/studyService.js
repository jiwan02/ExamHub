import api from './api';

export const studyService = {
  getCategories: () => api.get('/user/categories'),

  getTopics: (categoryId) => api.get(`/user/categories/${categoryId}/topics`),

  getStudyMaterials: (params) =>
    api.get('/user/study-materials', { params }),

  downloadStudyMaterial: (id) =>
    api.get(`/user/study-materials/${id}/download`, { responseType: 'blob' }),

  generateTest: (id) => api.get(`/user/study-materials/${id}/test`),

  submitTest: (data) => api.post('/user/study-materials/test/submit', data),
};
