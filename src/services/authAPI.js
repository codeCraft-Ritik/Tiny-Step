// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to normalize user object - convert MongoDB _id to id for frontend consistency
const normalizeUser = (user) => {
  if (!user) return null;
  const normalized = { ...user };
  if (normalized._id && !normalized.id) {
    normalized.id = normalized._id; // Add 'id' as alias for '_id'
  }
  return normalized;
};

// Auth API Service
const authAPI = {
  // Signup
  signup: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Throw detailed error message from API
        throw new Error(data.message || 'Signup failed');
      }

      // Store token and normalize user object
      if (data.data.token && data.data.user) {
        const normalizedUser = normalizeUser(data.data.user);
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        console.log('✅ Signup successful:', normalizedUser);
      }

      return data;
    } catch (error) {
      console.error('❌ Signup error:', error.message);
      throw error;
    }
  },

  // Login
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and normalize user object
      if (data.data.token && data.data.user) {
        const normalizedUser = normalizeUser(data.data.user);
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        console.log('✅ Login successful:', normalizedUser);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user');
      }

      return data;
    } catch (error) {
      console.error('Get current user error:', error.message);
      throw error;
    }
  },

  // Logout
  logout: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

      return data;
    } catch (error) {
      console.error('Logout error:', error.message);
      // Clear local storage even if logout fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw error;
    }
  },

  // Update profile
  updateProfile: async (token, profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      return data;
    } catch (error) {
      console.error('Update profile error:', error.message);
      throw error;
    }
  },

  // Change password
  changePassword: async (token, passwordData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password change failed');
      }

      return data;
    } catch (error) {
      console.error('Change password error:', error.message);
      throw error;
    }
  },

  // Delete account
  deleteAccount: async (token, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/delete-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Account deletion failed');
      }

      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

      return data;
    } catch (error) {
      console.error('Delete account error:', error.message);
      throw error;
    }
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      // Store token and user data
      if (data.data.token) {
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        console.log('✅ Email verified and user logged in:', data.data.user);
      }

      return data;
    } catch (error) {
      console.error('❌ OTP verification error:', error.message);
      throw error;
    }
  },

  // Resend OTP
  resendOTP: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      return data;
    } catch (error) {
      console.error('❌ Resend OTP error:', error.message);
      throw error;
    }
  },

  // Helper: Get auth token
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Helper: Get user
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? normalizeUser(JSON.parse(user)) : null;
  },

  // Helper: Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Helper: Clear auth
  clearAuth: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};

export default authAPI;
