import api from './api';

export const adminService = {
  postVacancy: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'images' && data.images) {
        data.images.forEach(file => formData.append('Images', file));
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.post('/AdminVacancy', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  manageVacancies: () => api.get('/AdminVacancy/manage'),

  getAllUsers: () => api.get('/AdminVacancy/all-users'),

  getTrackedUsers: () => api.get('/AdminVacancy/tracked-users'),

  postVacancyUpdate: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'images' && data.images) {
        data.images.forEach(file => formData.append('Images', file));
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.post('/AdminVacancy/post-vacancy-update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  createCategory: (data) => api.post('/admin/categories', data),

  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

  createTopic: (data) => api.post('/admin/topics', data),

  deleteTopic: (id) => api.delete(`/admin/topics/${id}`),

  uploadStudyMaterial: (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.categoryId) formData.append('categoryId', data.categoryId);
    if (data.topicId) formData.append('topicId', data.topicId);
    formData.append('file', data.file);
    return api.post('/admin/study-materials', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteStudyMaterial: (id) => api.delete(`/admin/study-materials/${id}`),
};
