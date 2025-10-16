// API service for database operations

const API_BASE = '/.netlify/functions';

// Get auth token from localStorage
function getAuthToken() {
  return localStorage.getItem('authToken');
}

// Check if user is authenticated
export function isAuthenticated() {
  return !!getAuthToken();
}

// Redirect to login if not authenticated
export function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

// Logout
export function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userEmail');
  window.location.href = '/login.html';
}

// Make authenticated API request
async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid - redirect to login
    logout();
    throw new Error('Authentication required');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

// User Profile API
export async function getUserProfile() {
  return await apiRequest('/user-profile', { method: 'GET' });
}

export async function updateUserProfile(profile, goals) {
  return await apiRequest('/user-profile', {
    method: 'PUT',
    body: JSON.stringify({ profile, goals }),
  });
}

// Daily Logs API
export async function getDailyLog(date) {
  return await apiRequest(`/daily-logs?date=${date}`, { method: 'GET' });
}

export async function saveDailyLog(date, meals, workouts, notes) {
  return await apiRequest('/daily-logs', {
    method: 'POST',
    body: JSON.stringify({ date, meals, workouts, notes }),
  });
}

export async function deleteDailyLog(date) {
  return await apiRequest(`/daily-logs?date=${date}`, { method: 'DELETE' });
}

// Weight History API
export async function getWeightHistory() {
  return await apiRequest('/weight-history', { method: 'GET' });
}

export async function addWeightEntry(date, weight) {
  return await apiRequest('/weight-history', {
    method: 'POST',
    body: JSON.stringify({ date, weight }),
  });
}

// Helper: Format date for API (YYYY-MM-DD)
export function formatDateForAPI(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
