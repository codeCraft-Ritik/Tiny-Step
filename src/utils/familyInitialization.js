/**
 * Family Profile Initialization Utility
 * Ensures all user profiles have proper family structure
 */

import authAPI from '../services/authAPI';
import { createOrUpdateFamilyProfile } from './familyScore';

/**
 * Initialize or upgrade user profile with family data
 * Call this on app startup and user login
 */
export const initializeUserProfileWithFamily = () => {
  try {
    const user = authAPI.getUser();
    if (!user || !user.id) {
      return false;
    }

    const userKey = `userProfile_${user.id}`;
    let profile = {};
    const existing = localStorage.getItem(userKey);

    if (existing) {
      profile = JSON.parse(existing);
    }

    // Get user's proper name (firstName + lastName from signup)
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim() || user.email?.split('@')[0] || `User_${user.id}`;
    
    const familyName = profile.familyName || `${fullName}'s Family`;
    const role = profile.role || 'parent'; // Default to parent for new signups
    const parentId = profile.parentId || null;

    // Store detailed profile information
    profile.userId = user.id;
    profile.email = user.email;
    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.fullName = fullName;
    profile.userName = fullName; // Update to use full name instead of email
    profile.familyName = familyName;
    profile.role = role;
    profile.parentId = parentId;
    profile.points = profile.points || 0;
    profile.tasksCompleted = profile.tasksCompleted || 0;
    profile.createdAt = profile.createdAt || new Date().toLocaleDateString();
    profile.lastUpdated = new Date().toLocaleString();

    localStorage.setItem(userKey, JSON.stringify(profile));

    console.log(`✅ User profile initialized: ${fullName} (${role})`);
    return true;
  } catch (error) {
    console.error("Error initializing user profile:", error);
    return false;
  }
};

/**
 * Link a child user to a parent user
 * @param {string} childUserId - The child's user ID
 * @param {string} parentUserId - The parent's user ID
 * @param {string} familyName - The family name
 * @returns {boolean} Success status
 */
export const linkChildToParent = (childUserId, parentUserId, familyName) => {
  try {
    // Update child profile with parent reference
    createOrUpdateFamilyProfile(
      childUserId,
      familyName,
      'child',
      parentUserId
    );

    // Ensure parent profile is also updated
    createOrUpdateFamilyProfile(
      parentUserId,
      familyName,
      'parent',
      null
    );

    console.log(`✅ Child ${childUserId} linked to parent ${parentUserId}`);
    return true;
  } catch (error) {
    console.error("Error linking child to parent:", error);
    return false;
  }
};

/**
 * Migrate old profiles to new family structure
 * Call this once to upgrade existing user data
 */
export const migrateProfilesToFamilyStructure = () => {
  try {
    let migratedCount = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.startsWith("userProfile_")) {
        const profile = JSON.parse(localStorage.getItem(key));
        const userId = profile.userId || key.replace("userProfile_", "");

        // Check if profile needs migration
        if (!profile.familyId) {
          const familyName = profile.familyName || `${profile.userName || 'User'}'s Family`;
          const role = profile.role || 'child';
          const parentId = profile.parentId || null;

          createOrUpdateFamilyProfile(userId, familyName, role, parentId);
          migratedCount++;
        }
      }
    }

    if (migratedCount > 0) {
      console.log(`✅ Migrated ${migratedCount} profiles to family structure`);
    }

    return migratedCount;
  } catch (error) {
    console.error("Error during migration:", error);
    return 0;
  }
};

export default {
  initializeUserProfileWithFamily,
  linkChildToParent,
  migrateProfilesToFamilyStructure
};
