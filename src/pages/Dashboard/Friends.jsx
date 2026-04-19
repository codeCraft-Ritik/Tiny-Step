import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Star, Award, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import Footer from "../../components/Footer";
import authAPI from "../../services/authAPI";

function Friends() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  // Get current user ID on mount
  useEffect(() => {
    try {
      const user = authAPI.getUser();
      if (user && user.id) {
        setUserId(user.id);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error getting user:", error);
      navigate("/");
    }
  }, [navigate]);

  // Load leaderboard data from localStorage
  useEffect(() => {
    if (userId) {
      const loadLeaderboardData = () => {
        try {
          console.log("📊 Loading leaderboard data...");
          const profiles = [];
          
          // Scan all user profiles from localStorage
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            
            if (key && key.startsWith("userProfile_")) {
              const profileData = JSON.parse(localStorage.getItem(key));
              
              // Skip parent profiles (they have fatherName/motherName)
              if (profileData.fatherName || profileData.motherName) {
                console.log("⏭️ Skipping parent profile:", key);
                continue;
              }
              
              // Extract child name from key or profile
              let childName = key.replace("userProfile_", "");
              if (!childName || childName === userId) {
                childName = profileData.childName || profileData.firstName || profileData.name || "Child";
              }
              
              const points = profileData.points || 0;
              const tasksCompleted = profileData.tasksCompleted || 0;
              
              console.log(`✅ Found child profile: ${childName} - ${points} points`);
              
              profiles.push({
                userId: childName, // Use child name as identifier
                childName: childName,
                userName: childName,
                points: points,
                tasksCompleted: tasksCompleted,
                lastUpdated: profileData.lastPointsUpdate || profileData.lastUpdated
              });
            }
          }
          
          // Sort by points (descending)
          profiles.sort((a, b) => b.points - a.points);
          
          // Add ranking
          const rankedProfiles = profiles.map((profile, index) => ({
            ...profile,
            rank: index + 1
          }));
          
          console.log(`📊 Leaderboard loaded: ${rankedProfiles.length} children`);
          setLeaderboard(rankedProfiles);
          
          // Find current user's position (for child users)
          const user = authAPI.getUser();
          const role = user?.role || "child";
          
          if (role === "child") {
            const userFirstName = user?.firstName || user?.name || "Child";
            const currentPosition = rankedProfiles.find(p => p.childName === userFirstName);
            console.log("🏅 Current user position:", currentPosition);
            setUserPosition(currentPosition);
            
            // Load current user profile
            const childProfileKey = `userProfile_${userFirstName}`;
            const userProfileData = localStorage.getItem(childProfileKey);
            if (userProfileData) {
              const profile = JSON.parse(userProfileData);
              setCurrentUserProfile({
                userId: userFirstName,
                childName: userFirstName,
                points: profile.points || 0,
                tasksCompleted: profile.tasksCompleted || 0
              });
              console.log("👤 Current user profile loaded:", profile);
            }
          }
        } catch (error) {
          console.error("Error loading leaderboard:", error);
          setLeaderboard([]);
        }
      };
      
      loadLeaderboardData();
      
      // Set up visibility listener to refresh leaderboard when page becomes visible
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          console.log("📄 Leaderboard page became visible, refreshing...");
          loadLeaderboardData();
        }
      };
      
      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
  }, [userId]);

  if (!userId) {
    return (
      <div className="min-h-screen bg-[#ece9ef] flex items-center justify-center">
        <p className="text-[24px] font-black text-[#2b290f]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ece9ef] pb-20">
      {/* TOP NAVIGATION BAR */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#d8d3be] bg-[#e8e5d8e8] backdrop-blur">
        <div className="mx-auto flex h-18 w-[min(1200px,92vw)] items-center justify-between md:h-20 px-3 md:px-8">
          <div className="flex items-center gap-2 md:gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/Dashboard")}
              className="p-2 hover:bg-[#d8d3be] rounded-full transition"
            >
              <ArrowLeft size={20} className="text-[#3b3a2a] md:w-6 md:h-6" />
            </motion.button>
            <div className="flex items-center gap-1.5 md:gap-2 text-xl md:text-4xl font-extrabold tracking-tight text-[#3b3a2a]">
              <img src={Logo} alt="TinySteps logo" className="h-10 w-10 md:h-14 md:w-14 rounded-lg object-contain" />
              <span className="text-sm md:text-4xl">Tiny<span className="text-[#f2a61c]">Steps</span></span>
            </div>
          </div>
          <Users size={24} className="text-[#f6b500]" />
        </div>
      </nav>

      <div className="px-2 md:px-3 py-6 md:px-8 md:py-8 pt-20 md:pt-28">
        <div className="mx-auto max-w-4xl">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 md:mb-8"
          >
            <h1 className="text-[32px] md:text-[44px] lg:text-[56px] leading-none font-black text-[#2b290f] mb-2">Friends Leaderboard</h1>
            <p className="text-[16px] md:text-[22px] font-semibold text-[#615b36]">🏆 See who has the most points! 🏆</p>
          </motion.div>

          {/* YOUR STATS CARD */}
          {currentUserProfile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 rounded-3xl bg-gradient-to-r from-[#8fd4ff] to-[#b5ec66] p-6 md:p-8 shadow-[0_8px_16px_rgba(0,0,0,0.1)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-4xl md:text-5xl">⭐</span>
                    <h2 className="text-[20px] md:text-[28px] font-black text-[#2b290f]">Your Profile</h2>
                  </div>
                  <p className="text-[14px] md:text-[16px] font-semibold text-[#2b290f] mb-3">
                    🏅 Rank: <span className="font-black text-[#f6b500]">#{userPosition?.rank || "—"}</span>
                  </p>
                  <div className="flex gap-4 flex-wrap">
                    <div className="rounded-2xl bg-white px-4 py-2 shadow">
                      <p className="text-[12px] font-bold text-[#2e4d00]">POINTS</p>
                      <p className="text-[24px] md:text-[28px] font-black text-[#3b700a]">{currentUserProfile.points || 0}</p>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-2 shadow">
                      <p className="text-[12px] font-bold text-[#0d7a9d]">TASKS DONE</p>
                      <p className="text-[24px] md:text-[28px] font-black text-[#0d7a9d]">{currentUserProfile.tasksCompleted || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* LEADERBOARD */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-[24px] md:text-[28px] font-black text-[#2b290f] mb-4 flex items-center gap-2">
              <Trophy size={24} className="text-[#f6b500]" />
              Top Achievers
            </h2>

            {leaderboard.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 rounded-3xl bg-white shadow"
              >
                <p className="text-[20px] font-black text-[#2b290f] mb-2">No leaderboard yet! 🚀</p>
                <p className="text-[16px] font-semibold text-[#615b36]">Complete tasks to earn points and appear here!</p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((profile, index) => {
                  const isCurrentUser = profile.userId === userId;
                  const medalEmoji = profile.rank === 1 ? "🥇" : profile.rank === 2 ? "🥈" : profile.rank === 3 ? "🥉" : "";
                  
                  return (
                    <motion.div
                      key={profile.userId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`rounded-2xl md:rounded-3xl p-4 md:p-6 border-2 shadow transition ${
                        isCurrentUser
                          ? "bg-gradient-to-r from-[#aff260] to-[#b5ec66] border-[#3b700a]/50"
                          : profile.rank <= 3
                          ? "bg-[#fff8e1] border-[#f5d66f]"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {/* Rank */}
                          <div className={`flex-shrink-0 h-12 w-12 md:h-14 md:w-14 rounded-full flex items-center justify-center text-2xl md:text-3xl font-black ${
                            profile.rank === 1 ? "bg-[#ffd700]" :
                            profile.rank === 2 ? "bg-[#c0c0c0]" :
                            profile.rank === 3 ? "bg-[#cd7f32]" :
                            "bg-[#e0e0e0]"
                          }`}>
                            {medalEmoji || profile.rank}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-[16px] md:text-[18px] font-black text-[#2b290f] truncate">
                                {isCurrentUser ? "👤 You" : profile.userName}
                              </h3>
                              {isCurrentUser && (
                                <span className="text-[12px] md:text-[13px] bg-[#3f8700] text-white px-2 py-1 rounded-full font-bold">
                                  YOUR PROFILE
                                </span>
                              )}
                            </div>
                            <p className="text-[12px] md:text-[13px] text-[#615b36] font-semibold">
                              {profile.tasksCompleted} tasks completed
                            </p>
                          </div>
                        </div>

                        {/* Points */}
                        <div className="flex-shrink-0">
                          <div className="rounded-2xl bg-white px-4 py-2 text-center shadow">
                            <p className="text-[12px] font-bold text-[#6b5300]">POINTS</p>
                            <p className="text-[24px] md:text-[28px] font-black text-[#f6b500] flex items-center gap-1">
                              <Star size={18} className="fill-[#f6b500]" />
                              {profile.points}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* TIPS SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 rounded-3xl bg-[#ece5a7] p-6 md:p-8 shadow-[0_8px_16px_rgba(0,0,0,0.08)]"
          >
            <h3 className="text-[20px] md:text-[24px] font-black text-[#2e2b13] mb-3 flex items-center gap-2">
              <Award size={24} />
              How to Earn Points?
            </h3>
            <ul className="space-y-2">
              <li className="flex gap-2 text-[14px] md:text-[16px] font-semibold text-[#2e2b13]">
                <span className="text-[20px]">✅</span>
                <span>Complete any task to earn <span className="font-black">5 ⭐ points</span></span>
              </li>
              <li className="flex gap-2 text-[14px] md:text-[16px] font-semibold text-[#2e2b13]">
                <span className="text-[20px]">🏆</span>
                <span>Compete with friends and climb the leaderboard</span>
              </li>
              <li className="flex gap-2 text-[14px] md:text-[16px] font-semibold text-[#2e2b13]">
                <span className="text-[20px]">🥇</span>
                <span>Top 3 players get special badges!</span>
              </li>
            </ul>
          </motion.div>

          {/* PARENT'S CORNER SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 rounded-3xl bg-gradient-to-br from-[#b5ec66] via-[#aff260] to-[#dfefd0] p-6 md:p-8 shadow-[0_8px_16px_rgba(0,0,0,0.1)] border-2 border-[#3b700a]/20"
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl md:text-5xl flex-shrink-0">👨‍👩‍👧‍👦</span>
              <div className="flex-1">
                <h3 className="text-[20px] md:text-[24px] font-black text-[#2e4d00] mb-3">
                  💡 Parent's Corner
                </h3>
                <p className="text-[16px] md:text-[18px] font-bold text-[#2e4d00] leading-relaxed italic">
                  "Research shows creative tasks boost problem-solving by 30%—but the real breakthrough is watching your child's confidence soar with every creation. 🎨✨"
                </p>
                <p className="text-[12px] md:text-[14px] text-[#3b700a] font-semibold mt-4">
                  🌟 Encourage creativity and learning through playful tasks!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Friends;
