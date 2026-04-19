import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('devcollab_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('devcollab_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const getUserById = (id) => api.get(`/auth/user/${id}`);
export const updateProfile = (data) => api.put('/auth/me', data);

// Posts
export const getPosts = (page = 1, tag = '') => api.get(`/posts?page=${page}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`);
export const getPostsByUser = (userId) => api.get(`/posts/user/${userId}`);
export const createPost = (data) => api.post('/posts', data);
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const likePost = (id) => api.post(`/posts/like/${id}`);
export const addComment = (postId, text) => api.post(`/posts/${postId}/comments`, { text });
export const deleteComment = (postId, commentId) => api.delete(`/posts/${postId}/comments/${commentId}`);

// Users
export const getUsers = () => api.get('/users');
export const searchUsers = (q) => api.get(`/users/search?q=${encodeURIComponent(q)}`);
export const followUser = (userId) => api.post(`/users/follow/${userId}`);

export default api;
