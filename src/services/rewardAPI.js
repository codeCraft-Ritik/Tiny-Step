// Rewards API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const rewardAPI = {
  // Get all rewards for a child
  getChildRewards: async (childId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rewards/child/${childId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching child rewards:', error);
      throw error;
    }
  },

  // Create a new reward
  createReward: async (rewardData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rewards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rewardData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating reward:', error);
      throw error;
    }
  },

  // Redeem a reward
  redeemReward: async (rewardId, childId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rewards/${rewardId}/redeem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ childId }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error redeeming reward:', error);
      throw error;
    }
  },

  // Get reward by ID
  getRewardById: async (rewardId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rewards/detail/${rewardId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching reward:', error);
      throw error;
    }
  },

  // Update reward
  updateReward: async (rewardId, updateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rewards/${rewardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating reward:', error);
      throw error;
    }
  },

  // Delete reward
  deleteReward: async (rewardId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rewards/${rewardId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting reward:', error);
      throw error;
    }
  },

  // Get rewards by category
  getRewardsByCategory: async (category, childId = null) => {
    try {
      let url = `${API_BASE_URL}/rewards/category/${category}`;
      if (childId) {
        url += `?childId=${childId}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching rewards by category:', error);
      throw error;
    }
  },
};

export default rewardAPI;
