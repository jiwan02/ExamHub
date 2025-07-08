import api from './api';

export const authService = {
  login: (data) => api.post('/Auth/login', data),
  register: (data) => api.post('/Auth/register', data),
  changePassword: (data) => api.post('/Auth/change-password', data),
};
