// Family API Service - Handles all family-related database operations
const API_BASE_URL = "http://localhost:5000/api";

const familyAPI = {
  // Save family information (parent names, children)
  saveFamilyInfo: async (token, familyData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/family/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(familyData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Family info saved to database:", data);
      return data;
    } catch (error) {
      console.error("❌ Error saving family info:", error);
      throw error;
    }
  },

  // Get family information
  getFamilyInfo: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/family/get`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Family info retrieved from database:", data);
      return data;
    } catch (error) {
      console.error("❌ Error retrieving family info:", error);
      throw error;
    }
  },

  // Get all linked children for parent
  getLinkedChildren: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/family/children`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Linked children retrieved:", data);
      return data;
    } catch (error) {
      console.error("❌ Error retrieving linked children:", error);
      throw error;
    }
  },
};

export default familyAPI;
