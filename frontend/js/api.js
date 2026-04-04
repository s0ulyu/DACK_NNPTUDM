// ==========================================
// API.JS - API Helper with JWT
// ==========================================

const API_BASE = '/api';

// Get stored token
function getToken() {
  return localStorage.getItem('token');
}

// Get stored user info
function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Save auth data
function saveAuth(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

// Clear auth data
function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// Check if logged in
function isLoggedIn() {
  return !!getToken();
}

// Redirect if not logged in
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = '/';
    return false;
  }
  return true;
}

// Main API fetch wrapper
async function api(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Token expired or invalid
      if (response.status === 401) {
        clearAuth();
        window.location.href = '/';
        return;
      }
      throw new Error(data.message || 'Có lỗi xảy ra');
    }

    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Không thể kết nối server');
    }
    throw error;
  }
}

// Shorthand methods
const API = {
  get: (endpoint) => api(endpoint, { method: 'GET' }),
  post: (endpoint, body) => api(endpoint, {
    method: 'POST',
    body: JSON.stringify(body)
  }),
  put: (endpoint, body) => api(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined
  }),
  delete: (endpoint) => api(endpoint, { method: 'DELETE' }),
};

// ===== Specific API calls =====

// Auth
async function loginAPI(email, password) {
  return API.post('/auth/login', { email, password });
}

// Rewards
async function getRewards(page = 1, limit = 12) {
  return API.get(`/rewards?page=${page}&limit=${limit}`);
}

async function redeemReward(rewardId) {
  return API.post(`/rewards/${rewardId}/redeem`);
}

// Points
async function getPointSummary() {
  return API.get('/points/summary');
}

async function getPointHistory(page = 1, limit = 20) {
  return API.get(`/points/history?page=${page}&limit=${limit}`);
}

// Leaderboard
async function getLeaderboard() {
  return API.get('/leaderboard');
}

async function getMyRank() {
  return API.get('/leaderboard/me');
}

// Notifications
async function getNotifications(page = 1, limit = 20) {
  return API.get(`/notifications?page=${page}&limit=${limit}`);
}

async function getUnreadCount() {
  return API.get('/notifications/unread-count');
}

async function markAsRead(notificationId) {
  return API.put(`/notifications/${notificationId}/read`);
}

async function markAllAsRead() {
  return API.put('/notifications/read-all');
}
