/**
 * Family Score Management Utility
 * Handles parent-child relationships and combined family scoring
 */

/**
 * Get all families with combined scores from localStorage
 * @returns {Array} Array of family objects with combined scores and members
 */
export const getAllFamilies = () => {
  const families = {};
  
  try {
    console.log(`🔍 Scanning localStorage for families...`);
    const storageLength = localStorage.length;
    console.log(`📦 Total items in localStorage: ${storageLength}`);
    
    // DEBUG: Log all localStorage keys to see what we have
    const allKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      allKeys.push(localStorage.key(i));
    }
    console.log(`📋 All localStorage keys:`, allKeys);
    
    // Scan all user profiles in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith("userProfile_")) {
        const profileData = JSON.parse(localStorage.getItem(key));
        const userId = profileData.userId;
        
        console.log(`👤 Profile: ${profileData.fullName || profileData.email} (role: ${profileData.role})`);
        console.log(`   Raw data:`, profileData); // Show complete profile
        
        // Determine family ID: use explicit familyId, or parentId for children, or own userId for parents
        let familyId;
        if (profileData.familyId) {
          familyId = profileData.familyId;
        } else if (profileData.parentId) {
          // Child profile: use parent's ID as family ID
          familyId = profileData.parentId;
          console.log(`  → Linking to parent family: ${familyId}`);
        } else {
          // Parent profile: use own ID as family ID
          familyId = userId;
          console.log(`  → Parent family: ${familyId}`);
        }
        
        if (!families[familyId]) {
          // Initialize family object
          let generatedFamilyName = "Family";
          
          // For parent profiles, use parent's full name or father/mother names
          if (profileData.role === 'parent') {
            // Priority: Use parent's full name if available
            if (profileData.fullName && profileData.fullName.trim()) {
              generatedFamilyName = `${profileData.fullName}'s Family`;
            } else if (profileData.firstName || profileData.lastName) {
              // Fallback: Construct from firstName + lastName
              const firstName = profileData.firstName || "";
              const lastName = profileData.lastName || "";
              const constructedName = `${firstName} ${lastName}`.trim();
              if (constructedName) {
                generatedFamilyName = `${constructedName}'s Family`;
              } else {
                // Fallback: Use father and mother names if name can't be constructed
                const fatherName = profileData.fatherName || "";
                const motherName = profileData.motherName || "";
                
                if (fatherName && motherName) {
                  generatedFamilyName = `${fatherName} & ${motherName}'s Family`;
                } else if (fatherName) {
                  generatedFamilyName = `${fatherName}'s Family`;
                } else if (motherName) {
                  generatedFamilyName = `${motherName}'s Family`;
                }
              }
            } else {
              // Final fallback: Use father and mother names
              const fatherName = profileData.fatherName || "";
              const motherName = profileData.motherName || "";
              
              if (fatherName && motherName) {
                generatedFamilyName = `${fatherName} & ${motherName}'s Family`;
              } else if (fatherName) {
                generatedFamilyName = `${fatherName}'s Family`;
              } else if (motherName) {
                generatedFamilyName = `${motherName}'s Family`;
              }
            }
          } else {
            // For child profiles, use stored familyName or generate from user name
            generatedFamilyName = profileData.familyName || `Family of ${profileData.fullName || profileData.userName || userId}`;
          }
          
          families[familyId] = {
            familyId: familyId,
            familyName: generatedFamilyName,
            parentId: profileData.parentId || null,
            fatherName: profileData.fatherName || "",
            motherName: profileData.motherName || "",
            members: [],
            totalPoints: 0,
            totalTasksCompleted: 0,
            createdAt: profileData.createdAt || new Date().toLocaleDateString()
          };
        } else {
          // If this is a parent profile, update the family name
          if (profileData.role === 'parent') {
            // Priority: Use parent's full name if available
            if (profileData.fullName && profileData.fullName.trim()) {
              families[familyId].familyName = `${profileData.fullName}'s Family`;
            } else if (profileData.firstName || profileData.lastName) {
              // Fallback: Construct from firstName + lastName
              const firstName = profileData.firstName || "";
              const lastName = profileData.lastName || "";
              const constructedName = `${firstName} ${lastName}`.trim();
              if (constructedName) {
                families[familyId].familyName = `${constructedName}'s Family`;
              } else {
                // Fallback: Use father and mother names if name can't be constructed
                const fatherName = profileData.fatherName || "";
                const motherName = profileData.motherName || "";
                
                if (fatherName && motherName) {
                  families[familyId].familyName = `${fatherName} & ${motherName}'s Family`;
                } else if (fatherName) {
                  families[familyId].familyName = `${fatherName}'s Family`;
                } else if (motherName) {
                  families[familyId].familyName = `${motherName}'s Family`;
                }
              }
            } else {
              // Final fallback: Use father and mother names
              const fatherName = profileData.fatherName || "";
              const motherName = profileData.motherName || "";
              
              if (fatherName && motherName) {
                families[familyId].familyName = `${fatherName} & ${motherName}'s Family`;
              } else if (fatherName) {
                families[familyId].familyName = `${fatherName}'s Family`;
              } else if (motherName) {
                families[familyId].familyName = `${motherName}'s Family`;
              }
            }
            
            families[familyId].fatherName = profileData.fatherName || "";
            families[familyId].motherName = profileData.motherName || "";
          }
        }
        
        // Get display name based on user role - prefer firstName + lastName
        let displayName = profileData.fullName || profileData.userName;
        
        // If fullName not available, try to construct from firstName + lastName
        if (!displayName && (profileData.firstName || profileData.lastName)) {
          const firstName = profileData.firstName || "";
          const lastName = profileData.lastName || "";
          displayName = `${firstName} ${lastName}`.trim();
        }
        
        // Last resort: use email username or userId
        if (!displayName) {
          displayName = profileData.email?.split('@')[0] || `User_${userId}`;
        }
        
        let displayBadge = profileData.role === 'parent' ? '👨‍👩‍👧' : '👧';
        let roleLabel = profileData.role === 'parent' ? 'Parent' : 'Child';
        
        // Only add child profiles as members (not parents)
        // CRITICAL: Exclude the family owner (parent) by checking userId !== familyId
        if (profileData.role === 'child' && userId !== familyId) {
          // Add member to family
          families[familyId].members.push({
            userId: userId,
            userName: displayName,
            fullName: profileData.fullName,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            email: profileData.email,
            role: profileData.role || 'child', // 'parent' or 'child'
            points: profileData.points || 0,
            tasksCompleted: profileData.tasksCompleted || 0,
            badge: displayBadge,
            roleLabel: roleLabel
          });
          
          // Add to family totals
          families[familyId].totalPoints += profileData.points || 0;
          families[familyId].totalTasksCompleted += profileData.tasksCompleted || 0;
        }
        
        // If this is a parent profile, check for manually-added family children
        if (profileData.role === 'parent') {
          console.log(`👨 Parent Profile Details:`, {
            userId,
            fullName: profileData.fullName,
            email: profileData.email,
            children: profileData.children,
            childrenCount: profileData.children ? profileData.children.length : 0
          });
        }
        
        if (profileData.role === 'parent' && profileData.children && Array.isArray(profileData.children)) {
          console.log(`📋 Parent ${userId} has ${profileData.children.length} manually-added children:`, profileData.children);
          
          profileData.children.forEach(familyChild => {
            // Only add if not already in members (avoid duplicates)
            // CRITICAL: Also prevent adding the parent themselves
            const alreadyExists = families[familyId].members.some(m => m.userId === familyChild.id);
            const isParent = familyChild.id === userId; // Don't add parent to their own children
            
            console.log(`  Checking child: ${familyChild.name} (id: ${familyChild.id}) - exists: ${alreadyExists}, isParent: ${isParent}`);
            
            if (!alreadyExists && !isParent && familyChild.name) {
              console.log(`  ✅ Adding ${familyChild.name} to family ${familyId}`);
              families[familyId].members.push({
                userId: familyChild.id || `family_child_${familyChild.name}`,
                userName: familyChild.name, // Use the child's name directly
                fullName: familyChild.name,
                firstName: familyChild.name.split(' ')[0],
                lastName: familyChild.name.split(' ')[1] || '',
                email: "Family Member",
                role: 'child',
                points: familyChild.points || 0,
                tasksCompleted: familyChild.tasksCompleted || 0,
                badge: '👧',
                roleLabel: 'Child'
              });
              
              // Add to family totals
              families[familyId].totalPoints += familyChild.points || 0;
              families[familyId].totalTasksCompleted += familyChild.tasksCompleted || 0;
            }
          });
        }
      }
    }
  } catch (error) {
    console.error("Error getting families:", error);
    return [];
  }
  
  // Convert to array and sort by total points
  const familiesArray = Object.values(families).sort(
    (a, b) => b.totalPoints - a.totalPoints
  );
  
  console.log(`✅ Found ${familiesArray.length} families:`, 
    familiesArray.map(f => `${f.familyName} (${f.members.length} members)`)
  );
  
  return familiesArray;
};

/**
 * Get ranked families list
 * @returns {Array} Array of families with rank assigned
 */
export const getRankedFamilies = () => {
  const families = getAllFamilies();
  return families.map((family, index) => ({
    ...family,
    rank: index + 1,
    medal: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''
  }));
};

/**
 * Get specific family info by familyId
 * @param {string} familyId - The family ID
 * @returns {Object} Family object with all members and scores
 */
export const getFamilyById = (familyId) => {
  const families = getAllFamilies();
  return families.find(f => f.familyId === familyId) || null;
};

/**
 * Get current user's family
 * @param {string} userId - The user ID
 * @returns {Object} User's family object
 */
export const getUserFamily = (userId) => {
  try {
    const userKey = `userProfile_${userId}`;
    const userProfile = localStorage.getItem(userKey);
    
    if (!userProfile) return null;
    
    const profile = JSON.parse(userProfile);
    
    // Determine family ID: use explicit familyId, or parentId for children, or own userId
    let familyId;
    if (profile.familyId) {
      familyId = profile.familyId;
    } else if (profile.parentId) {
      // Child profile: use parent's ID as family ID
      familyId = profile.parentId;
    } else {
      // Parent profile: use own ID as family ID
      familyId = userId;
    }
    
    return getFamilyById(familyId);
  } catch (error) {
    console.error("Error getting user family:", error);
    return null;
  }
};

/**
 * Create or link user to a family
 * @param {string} userId - The user ID
 * @param {string} familyName - The family name
 * @param {string} role - 'parent' or 'child'
 * @param {string} parentId - Parent's user ID (if child)
 * @param {object} userInfo - Optional user info with firstName, lastName, email
 * @returns {Object} Updated user profile
 */
export const createOrUpdateFamilyProfile = (userId, familyName, role = 'parent', parentId = null, userInfo = null) => {
  try {
    const userKey = `userProfile_${userId}`;
    let profile = {};
    
    const existing = localStorage.getItem(userKey);
    if (existing) {
      profile = JSON.parse(existing);
    }
    
    // Determine family ID
    const familyId = role === 'parent' ? userId : (parentId || userId);
    
    profile.familyId = familyId;
    profile.familyName = familyName;
    profile.role = role;
    profile.userId = userId;
    
    // Update user info if provided
    if (userInfo) {
      profile.firstName = userInfo.firstName || profile.firstName || "";
      profile.lastName = userInfo.lastName || profile.lastName || "";
      profile.email = userInfo.email || profile.email;
      profile.fullName = `${profile.firstName} ${profile.lastName}`.trim() || `User ${userId}`;
      profile.userName = profile.fullName;
    }
    
    // Ensure defaults
    profile.userName = profile.userName || profile.fullName || `User ${userId}`;
    profile.points = profile.points || 0;
    profile.tasksCompleted = profile.tasksCompleted || 0;
    
    if (role === 'child' && parentId) {
      profile.parentId = parentId;
    }
    
    if (!profile.createdAt) {
      profile.createdAt = new Date().toLocaleDateString();
    }
    
    profile.lastUpdated = new Date().toLocaleString();
    
    localStorage.setItem(userKey, JSON.stringify(profile));
    return profile;
  } catch (error) {
    console.error("Error updating family profile:", error);
    return null;
  }
};

/**
 * Get family member statistics
 * @param {string} familyId - The family ID
 * @returns {Object} Statistics about the family
 */
export const getFamilyStats = (familyId) => {
  const family = getFamilyById(familyId);
  
  if (!family) return null;
  
  const parentMembers = family.members.filter(m => m.role === 'parent');
  const childMembers = family.members.filter(m => m.role === 'child');
  
  return {
    familyName: family.familyName,
    totalMembers: family.members.length,
    parentCount: parentMembers.length,
    childCount: childMembers.length,
    totalPoints: family.totalPoints,
    totalTasksCompleted: family.totalTasksCompleted,
    averagePointsPerMember: family.members.length > 0 ? Math.round(family.totalPoints / family.members.length) : 0,
    averageTasksPerChild: childMembers.length > 0 ? Math.round(family.totalTasksCompleted / childMembers.length) : 0,
    topMember: family.members.reduce((top, current) => 
      current.points > top.points ? current : top, family.members[0])
  };
};

/**
 * Get leaderboard position for a family
 * @param {string} familyId - The family ID
 * @returns {Object} Family with rank and medal
 */
export const getFamilyRank = (familyId) => {
  const ranked = getRankedFamilies();
  return ranked.find(f => f.familyId === familyId) || null;
};

export default {
  getAllFamilies,
  getRankedFamilies,
  getFamilyById,
  getUserFamily,
  createOrUpdateFamilyProfile,
  getFamilyStats,
  getFamilyRank
};
