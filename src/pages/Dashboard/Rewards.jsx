import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Gift, Star, CheckCircle, Lock, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import authAPI from "../../services/authAPI";

const categoryIcons = {
  stickers: "🎫",
  badges: "🏅",
  "screen-time": "📱",
  outing: "🎢",
  toy: "🧸",
  food: "🍕",
  "special-privilege": "👑",
  other: "⭐",
};

function Rewards() {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [childId, setChildId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedReward, setSelectedReward] = useState(null);
  const [error, setError] = useState(null);

  // Load user data on mount and when page becomes visible
  useEffect(() => {
    const loadUserData = () => {
      try {
        const user = authAPI.getUser();
        console.log("🔍 Current user:", user);
        if (user && user.id) {
          const role = user.role || "child";
          console.log("👤 User role:", role);
          
          // If child, load their own profile
          if (role === "child") {
            const childName = user?.firstName || user?.name || "Child";
            
            // Try multiple keys to find child's profile
            let foundPoints = null;
            
            // Try 1: userProfile_${childName}
            let tryKey = `userProfile_${childName}`;
            let childProfile = localStorage.getItem(tryKey);
            if (childProfile) {
              try {
                const profile = JSON.parse(childProfile);
                // Check if it's a child profile (has points) not parent profile (has fatherName)
                if (!profile.fatherName && !profile.motherName) {
                  foundPoints = profile.points || 0;
                  console.log(`✅ Found child profile at ${tryKey}:`, profile);
                }
              } catch (e) {
                console.error("Error parsing profile at", tryKey, e);
              }
            }
            
            // Try 2: userProfile_${userId}
            if (foundPoints === null) {
              tryKey = `userProfile_${user.id}`;
              childProfile = localStorage.getItem(tryKey);
              if (childProfile) {
                try {
                  const profile = JSON.parse(childProfile);
                  // Check if it's a child profile (has points) not parent profile (has fatherName)
                  if (!profile.fatherName && !profile.motherName) {
                    foundPoints = profile.points || 0;
                    console.log(`✅ Found child profile at ${tryKey}:`, profile);
                  } else {
                    console.log("⚠️ Found parent profile at", tryKey, "- not using this");
                  }
                } catch (e) {
                  console.error("Error parsing profile at", tryKey, e);
                }
              }
            }
            
            if (foundPoints !== null) {
              setUserPoints(foundPoints);
              console.log("🎁 Child points loaded:", foundPoints);
            } else {
              console.log("📭 No valid child profile found, setting points to 0");
              setUserPoints(0);
            }
          } else {
            // If parent, load first child's points
            const userKey = `userProfile_${user.id}`;
            const userProfile = localStorage.getItem(userKey);
            console.log("📦 Parent profile from localStorage:", userProfile);
            if (userProfile) {
              const profile = JSON.parse(userProfile);
              
              // Try to get child ID from multiple sources
              let selectedChildId = null;

              // First try: children array
              if (profile.children && profile.children.length > 0) {
                selectedChildId = profile.children[0]._id || profile.children[0].id;
              }

              // Second try: familyChildren array
              if (!selectedChildId && profile.familyChildren && profile.familyChildren.length > 0) {
                selectedChildId = profile.familyChildren[0]._id || profile.familyChildren[0].id;
              }

              if (selectedChildId) {
                console.log("👧 Selected child ID:", selectedChildId);
                setChildId(selectedChildId);
                
                // Also load child's points from their profile
                const childProfileKey = `userProfile_${selectedChildId}`;
                const childProfile = localStorage.getItem(childProfileKey);
                if (childProfile) {
                  const childData = JSON.parse(childProfile);
                  setUserPoints(childData.points || 0);
                  console.log("🎁 Child points loaded:", childData.points || 0);
                }
              } else {
                console.warn("⚠️ No valid child ID found in profile");
                setError("No child profile found. Please ensure you're logged in as a parent.");
              }
            }
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setError("Error loading user profile");
      }
    };
    
    loadUserData();
    
    // Set up a listener for visibility changes to refresh points
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("📄 Page became visible, refreshing points...");
        loadUserData();
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Load rewards when childId is set (parent mode) or for child mode
  useEffect(() => {
    const user = authAPI.getUser();
    const role = user?.role || "child";
    
    if (role === "parent") {
      // Parent mode: needs childId
      if (childId) {
        console.log("🔄 PARENT MODE - Triggering loadRewards with childId:", childId);
        setError(null);
        loadRewards();
      } else {
        console.warn("⚠️ No childId available yet for parent");
      }
    } else {
      // Child mode: load rewards from API with their own ID
      console.log("👧 CHILD MODE - Loading rewards from API");
      loadChildRewards();
    }
  }, [childId]);

  const loadRewards = async () => {
    try {
      if (!childId) {
        console.log("⏭️ Skipping loadRewards - no childId available (likely child user)");
        setLoading(false);
        return;
      }

      setLoading(true);
      console.log("📥 Loading rewards for childId:", childId);
      
      const apiUrl = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/rewards/child/${childId}`;
      console.log("📡 API URL:", apiUrl);
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      console.log("📦 Response status:", response.status);
      console.log("📦 Response data:", data);
      
      if (data.success) {
        console.log(`✅ Successfully loaded ${data.count} rewards`);
        setRewards(data.data || []);
        setError(null);
      } else {
        console.warn("⚠️ API returned non-success status:", data);
        setError(data.message || "Failed to load rewards");
        setRewards([]);
      }
    } catch (error) {
      console.error("❌ Error loading rewards:", error);
      setError("Error loading rewards: " + error.message);
      setRewards([]);
    } finally {
      setLoading(false);
    }
  };

  const loadChildRewards = async () => {
    try {
      const user = authAPI.getUser();
      
      if (!user || !user.id) {
        console.error("❌ No user ID available");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      console.log("📥 Loading rewards for child user:", user.id);
      
      // Use child's own ID to fetch rewards
      const apiUrl = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/rewards/child/${user.id}`;
      console.log("📡 API URL:", apiUrl);
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      console.log("📦 Response status:", response.status);
      console.log("📦 Response data:", data);
      
      if (data.success) {
        console.log(`✅ Successfully loaded ${data.count} rewards`);
        setRewards(data.data || []);
        setError(null);
      } else {
        console.warn("⚠️ API returned non-success status:", data);
        // Don't show error for child users, just load empty rewards
        setRewards([]);
        setError(null);
      }
    } catch (error) {
      console.error("❌ Error loading child rewards:", error);
      // Don't show error, just load empty rewards
      setRewards([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const filteredRewards = rewards.filter((reward) => {
    if (filter === "all") return true;
    if (filter === "unlocked") return userPoints >= reward.pointsRequired;
    if (filter === "locked") return userPoints < reward.pointsRequired;
    return true;
  });

  const handleRedeemReward = async (rewardId) => {
    try {
      console.log(`🔄 Redeeming reward: ${rewardId} for child: ${childId}`);
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/rewards/${rewardId}/redeem`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ childId }),
        }
      );
      
      const data = await response.json();
      console.log(`📦 Redeem response:`, data);
      
      if (data.success) {
        console.log(`✅ Reward redeemed successfully!`);
        alert("🎉 Reward redeemed successfully!");
        loadRewards();
        setSelectedReward(null);
      } else {
        console.error(`❌ Redeem failed: ${data.message}`);
        alert("Error: " + (data.message || "Failed to redeem reward"));
      }
    } catch (error) {
      console.error("❌ Error redeeming reward:", error);
      alert("Error redeeming reward: " + error.message);
    }
  };

  const handleSeedRewards = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/rewards/seed`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        alert(`✅ ${data.count} sample rewards created!`);
        loadRewards();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error seeding rewards:", error);
      alert("Error seeding rewards");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ece9ef] to-[#f5e8d8]">
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-[#d8d3be]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-[#2b290f] hover:text-[#f2a61c] transition"
          >
            <ArrowLeft size={20} />
            <span className="font-bold">Back</span>
          </button>
          <h1 className="text-3xl font-black text-[#f2a61c]">My Rewards</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-[#f5e499] px-4 py-2 rounded-full">
              <Trophy size={20} className="text-[#f2a61c]" />
              <span className="font-black text-[#2b290f]">{userPoints}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const user = authAPI.getUser();
                if (user && user.id) {
                  const userKey = `userProfile_${user.id}`;
                  const profile = JSON.parse(localStorage.getItem(userKey) || '{}');
                  profile.points = (profile.points || 0) + 25;
                  localStorage.setItem(userKey, JSON.stringify(profile));
                  setUserPoints(profile.points);
                  alert('➕ Added 25 points for testing!');
                }
              }}
              className="text-xs bg-[#3f8700] text-white px-3 py-2 rounded-full font-bold hover:bg-[#2d6400] transition"
              title="Click to add 25 points for testing"
            >
              +25 pts
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* STATS SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white rounded-[30px] p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#595140]">Total Points</p>
                <p className="text-4xl font-black text-[#f2a61c]">{userPoints}</p>
              </div>
              <Zap size={40} className="text-[#f2a61c]" />
            </div>
          </div>

          <div className="bg-white rounded-[30px] p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#595140]">Available Rewards</p>
                <p className="text-4xl font-black text-[#3f8700]">
                  {rewards.filter((r) => userPoints >= r.pointsRequired).length}
                </p>
              </div>
              <Gift size={40} className="text-[#3f8700]" />
            </div>
          </div>

          <div className="bg-white rounded-[30px] p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#595140]">Locked Rewards</p>
                <p className="text-4xl font-black text-[#d9860a]">
                  {rewards.filter((r) => userPoints < r.pointsRequired).length}
                </p>
              </div>
              <Lock size={40} className="text-[#d9860a]" />
            </div>
          </div>
        </motion.div>

        {/* FILTER BUTTONS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-3 mb-8 overflow-x-auto pb-2"
        >
          {["all", "unlocked", "locked"].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition ${
                filter === filterType
                  ? "bg-[#f2a61c] text-white shadow-lg"
                  : "bg-white text-[#2b290f] hover:bg-[#efe9ce]"
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* REWARDS GRID */}
        {error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border-2 border-red-500 rounded-[30px] p-12 text-center shadow-lg"
          >
            <p className="text-red-700 font-semibold text-lg mb-4">❌ {error}</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-red-500 text-white font-bold py-3 px-6 rounded-full hover:bg-red-600 transition"
            >
              Go Back to Dashboard
            </button>
          </motion.div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin">
                <Trophy size={40} className="text-[#f2a61c]" />
              </div>
              <p className="mt-4 text-[#595140] font-semibold">Loading rewards...</p>
            </div>
          </div>
        ) : filteredRewards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[30px] p-12 text-center shadow-lg"
          >
            <Gift size={60} className="mx-auto text-[#d8d3be] mb-4" />
            <p className="text-[#595140] font-semibold text-lg mb-6">
              {filter === "locked"
                ? "No locked rewards yet!"
                : filter === "unlocked"
                ? "Complete more tasks to unlock rewards!"
                : "No rewards available yet!"}
            </p>
            {filter === "all" && rewards.length === 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSeedRewards}
                className="bg-[#f2a61c] text-white font-black py-3 px-6 rounded-full hover:bg-[#df9f00] transition inline-block"
              >
                🌱 Create Sample Rewards
              </motion.button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((reward, index) => {
              const isUnlocked = userPoints >= reward.pointsRequired;
              return (
                <motion.div
                  key={reward._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedReward(reward)}
                  className={`rounded-[30px] p-6 shadow-lg cursor-pointer transform transition hover:scale-105 ${
                    isUnlocked
                      ? "bg-gradient-to-br from-[#c8e6c9] to-[#a5d6a7]"
                      : "bg-gradient-to-br from-[#eeeeee] to-[#e0e0e0] opacity-70"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-5xl">{reward.emoji || "🎁"}</span>
                    {isUnlocked && <CheckCircle size={24} className="text-[#2e7d32]" />}
                  </div>

                  <h3 className="text-xl font-black text-[#2f2a13] mb-2">{reward.title}</h3>
                  <p className="text-sm text-[#595140] mb-4 line-clamp-2">{reward.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-[#f2a61c]" />
                      <span className="font-bold text-[#2b290f]">{reward.pointsRequired}</span>
                    </div>
                    <span className="text-xs bg-white/50 px-3 py-1 rounded-full font-semibold">
                      {categoryIcons[reward.category] || "⭐"} {reward.category}
                    </span>
                  </div>

                  {isUnlocked && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 w-full bg-[#2e7d32] text-white font-black py-3 rounded-full hover:bg-[#1b5e20] transition"
                    >
                      ✨ REDEEM
                    </motion.button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* REWARD DETAIL MODAL */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[40px] p-8 max-w-md w-full shadow-2xl"
          >
            <div className="text-center">
              <span className="text-8xl block mb-4">{selectedReward.emoji || "🎁"}</span>
              <h2 className="text-3xl font-black text-[#2f2a13] mb-2">{selectedReward.title}</h2>
              <p className="text-[#595140] font-semibold mb-4">{selectedReward.description}</p>

              <div className="bg-[#f5e499] rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <Zap size={20} className="text-[#f2a61c]" />
                  <span className="text-2xl font-black text-[#2b290f]">
                    {selectedReward.pointsRequired} Points Required
                  </span>
                </div>
              </div>

              <div className="bg-[#efe9ce] rounded-2xl p-3 mb-6">
                <p className="text-xs font-semibold text-[#595140]">Category</p>
                <p className="text-lg font-black text-[#2f2a13]">
                  {categoryIcons[selectedReward.category] || "⭐"} {selectedReward.category}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedReward(null)}
                  className="flex-1 bg-[#efe9ce] text-[#2b290f] font-black py-3 rounded-full hover:bg-[#e7debb] transition"
                >
                  Close
                </button>
                {userPoints >= selectedReward.pointsRequired && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRedeemReward(selectedReward._id)}
                    className="flex-1 bg-[#2e7d32] text-white font-black py-3 rounded-full hover:bg-[#1b5e20] transition"
                  >
                    ✨ Redeem Now
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Rewards;
