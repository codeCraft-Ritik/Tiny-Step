import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Rocket, Brush, Wand2, Star, Palette, Play, BookOpen, Plus, ArrowLeft, Trash2, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import Footer from "../../components/Footer";
import authAPI from "../../services/authAPI";

const stickerOptions = [
  { id: "rocket", label: "Rocket", icon: Rocket, color: "#8fd4ff" },
  { id: "draw", label: "Draw", icon: Brush, color: "#f5d66f" },
  { id: "animal", label: "Animal", icon: Wand2, color: "#f5d66f" },
  { id: "star", label: "Star", icon: Star, color: "#f5d66f" },
  { id: "create", label: "Create", icon: Palette, color: "#f5d66f" },
  { id: "play", label: "Play", icon: Play, color: "#f5d66f" },
  { id: "read", label: "Read", icon: BookOpen, color: "#f5d66f" },
  { id: "more", label: "More", icon: Plus, color: "#f5f5f5" }
];

function Task() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isParent, setIsParent] = useState(false);
  const [userId, setUserId] = useState(null);
  const [availableChildren, setAvailableChildren] = useState([]);
  const [allParentTasks, setAllParentTasks] = useState([]);

  // Single unified load effect
  useEffect(() => {
    console.log("🚀 TASK PAGE: Initializing...");
    
    try {
      const user = authAPI.getUser();
      console.log("✅ Got user:", user);
      
      if (!user) {
        console.log("❌ NO USER - Redirecting to home");
        navigate("/");
        return;
      }
      
      const userID = user.id;
      const role = user.role || "child";
      console.log("👤 User:", { userID, role });
      
      setUserId(userID);
      setIsParent(role === "parent");
      
      // Load children list if parent
      if (role === "parent") {
        console.log("✅ IS PARENT - Loading children");
        const profileKey = `userProfile_${userID}`;
        const profileData = localStorage.getItem(profileKey);
        console.log("📦 Profile data found:", !!profileData);
        
        if (profileData) {
          try {
            const profile = JSON.parse(profileData);
            const kids = (profile.children || []).map(child => ({
              userId: child.id || `child_${child.name}`,
              name: child.name,
              age: child.age
            }));
            console.log("👨‍👩‍👧 Children loaded:", kids);
            setAvailableChildren(kids);
          } catch (e) {
            console.error("Error parsing profile:", e);
          }
        }
      } else {
        // For children, show their own tasks
        console.log("👧 IS CHILD - Loading own tasks");
      }
      
      setLoading(false);
      console.log("✅ INITIALIZATION COMPLETE");
      
    } catch (error) {
      console.error("❌ ERROR:", error);
      setLoading(false);
      navigate("/");
    }
  }, [navigate]);

  // Load parent tasks when children are available
  useEffect(() => {
    if (isParent && userId && availableChildren.length > 0) {
      console.log("📋 Loading parent tasks...");
      let tasks = [];
      
      availableChildren.forEach(child => {
        const key = `childTasks_${child.userId}`;
        const data = localStorage.getItem(key);
        
        if (data) {
          try {
            const childTasks = JSON.parse(data).filter(t => t.createdBy === userId);
            tasks = [...tasks, ...childTasks.map(t => ({
              ...t,
              childName: child.name,
              childAge: child.age,
              childUserId: child.userId
            }))];
          } catch (e) {
            console.error(`Error loading tasks for ${child.name}:`, e);
          }
        }
      });
      
      tasks.sort((a, b) => {
        const timeA = new Date(`2000/01/01 ${a.createdAt}`).getTime();
        const timeB = new Date(`2000/01/01 ${b.createdAt}`).getTime();
        return timeB - timeA;
      });
      
      console.log("✅ Tasks loaded:", tasks.length);
      setAllParentTasks(tasks);
    } else if (!isParent && userId) {
      // Load child's own tasks using their name from user profile
      console.log("📋 Loading child's own tasks...");
      
      const user = authAPI.getUser();
      const childName = user?.firstName || user?.name || "Child";
      console.log("🔑 Child name for task lookup:", childName);
      
      const childKey = `childTasks_${childName}`;
      console.log("🔍 Looking for tasks at key:", childKey);
      const data = localStorage.getItem(childKey);
      
      if (data) {
        try {
          const childTasks = JSON.parse(data);
          childTasks.sort((a, b) => {
            const timeA = new Date(`2000/01/01 ${a.createdAt}`).getTime();
            const timeB = new Date(`2000/01/01 ${b.createdAt}`).getTime();
            return timeB - timeA;
          });
          console.log("✅ Child tasks loaded:", childTasks.length);
          setAllParentTasks(childTasks);
        } catch (e) {
          console.error("Error loading child tasks:", e);
        }
      } else {
        console.log("📭 No tasks found for this child");
      }
    }
  }, [isParent, userId, availableChildren]);

  const getStickerInfo = (categoryId) => {
    // Map category IDs to sticker options
    const categoryToSticker = {
      "play": "rocket",
      "activity": "play",
      "meal": "rocket",
      "learning": "read",
      "creative": "draw",
      "exercise": "play",
      "sleep": "star",
      "other": "more"
    };
    const stickerId = categoryToSticker[categoryId] || "more";
    return stickerOptions.find(s => s.id === stickerId);
  };

  const handleDeleteTask = (id) => {
    const task = allParentTasks.find(t => t.id === id);
    if (!task) return;
    
    // For parent view: use childUserId
    // For child view: use child's name from user profile
    let key;
    
    if (isParent) {
      key = `childTasks_${task.childUserId}`;
    } else {
      const user = authAPI.getUser();
      const childName = user?.firstName || user?.name || "Child";
      key = `childTasks_${childName}`;
    }
    
    const data = localStorage.getItem(key);
    
    if (data) {
      try {
        const tasks = JSON.parse(data).filter(t => t.id !== id);
        localStorage.setItem(key, JSON.stringify(tasks));
        setAllParentTasks(allParentTasks.filter(t => t.id !== id));
      } catch (e) {
        console.error("Error deleting task:", e);
      }
    }
  };

  const handleMarkComplete = (taskId) => {
    console.log("✅ Marking task complete:", taskId);
    
    const task = allParentTasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Update task in allParentTasks
    const updatedTasks = allParentTasks.map(t =>
      t.id === taskId ? { ...t, completed: true, completedAt: new Date().toLocaleTimeString() } : t
    );
    setAllParentTasks(updatedTasks);
    
    // Save to localStorage
    let key;
    if (isParent) {
      key = `childTasks_${task.childUserId}`;
    } else {
      const user = authAPI.getUser();
      const childName = user?.firstName || user?.name || "Child";
      key = `childTasks_${childName}`;
    }
    
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const tasks = JSON.parse(data).map(t =>
          t.id === taskId ? { ...t, completed: true, completedAt: new Date().toLocaleTimeString() } : t
        );
        localStorage.setItem(key, JSON.stringify(tasks));
        console.log("💾 Task saved to localStorage");
      } catch (e) {
        console.error("Error updating task:", e);
      }
    }
    
    // Award points to child
    awardPointsToChild(task);
  };

  const awardPointsToChild = (task) => {
    try {
      const user = authAPI.getUser();
      
      if (!user) {
        console.error("No user found");
        return;
      }
      
      // Determine child ID or name
      let childIdentifier;
      let childFirstName;
      
      if (isParent) {
        childIdentifier = task.childUserId;
        childFirstName = task.childName;
      } else {
        childIdentifier = user?.id;
        childFirstName = user?.firstName || user?.name || "Child";
      }
      
      console.log("🎁 Awarding points to:", { childIdentifier, childFirstName });
      
      const pointsToAward = 5;
      
      // Key 1: userProfile_${childFirstName} - PRIMARY KEY for child
      // This is where Rewards.jsx looks first
      const childNameKey = `userProfile_${childFirstName}`;
      const profileData1 = localStorage.getItem(childNameKey);
      let profile1 = {};
      if (profileData1) {
        try {
          profile1 = JSON.parse(profileData1);
        } catch (e) {
          console.error("Error parsing profile1:", e);
          profile1 = {};
        }
      }
      
      profile1.points = (profile1.points || 0) + pointsToAward;
      profile1.childName = childFirstName; // Mark as child profile
      profile1.lastPointsUpdate = new Date().toLocaleString();
      
      localStorage.setItem(childNameKey, JSON.stringify(profile1));
      console.log(`✅ Saved ${pointsToAward} points to key: ${childNameKey} (Total: ${profile1.points})`);
      
      // Key 2: userProfile_${childUserId} - BACKUP KEY
      // Also save here for compatibility
      const childIdKey = `userProfile_${childIdentifier}`;
      const profileData2 = localStorage.getItem(childIdKey);
      let profile2 = {};
      if (profileData2) {
        try {
          profile2 = JSON.parse(profileData2);
          // Only update if it's not the parent profile
          if (!profile2.fatherName && !profile2.motherName) {
            profile2.points = (profile2.points || 0) + pointsToAward;
            profile2.childName = childFirstName;
            profile2.lastPointsUpdate = new Date().toLocaleString();
            localStorage.setItem(childIdKey, JSON.stringify(profile2));
            console.log(`✅ Also saved ${pointsToAward} points to key: ${childIdKey} (Total: ${profile2.points})`);
          }
        } catch (e) {
          console.error("Error parsing profile2:", e);
        }
      } else {
        // Create new profile if doesn't exist
        profile2 = {
          points: pointsToAward,
          childName: childFirstName,
          lastPointsUpdate: new Date().toLocaleString()
        };
        localStorage.setItem(childIdKey, JSON.stringify(profile2));
        console.log(`✅ Created new profile at key: ${childIdKey} (Total: ${profile2.points})`);
      }
      
      console.log("✅ Points awarded and saved to all keys");
    } catch (error) {
      console.error("Error awarding points:", error);
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-[#ece9ef] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <p className="text-2xl font-black text-[#2b290f] mb-4">Loading...</p>
          <div className="text-5xl">🚀</div>
        </motion.div>
      </div>
    );
  }

  // PARENT VIEW OR CHILD VIEW
  return (
    <div className="min-h-screen bg-[#ece9ef] pb-20">
      {/* NAV */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#d8d3be] bg-[#e8e5d8e8] backdrop-blur">
        <div className="mx-auto flex h-20 w-[min(1200px,92vw)] items-center justify-between px-3 md:px-8">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => navigate("/Dashboard")}
              className="p-2 hover:bg-[#d8d3be] rounded-full"
            >
              <ArrowLeft size={24} className="text-[#3b3a2a]" />
            </motion.button>
            <div className="flex items-center gap-2">
              <img src={Logo} alt="Logo" className="h-14 w-14 rounded-lg object-contain" />
              <span className="text-3xl font-black text-[#3b3a2a]">Tiny<span className="text-[#f2a61c]">Steps</span></span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-[#f6b500]" />
            <span className="font-bold text-[#2b290f]">{allParentTasks.filter(t => t.completed).length} Done!</span>
          </div>
        </div>
      </nav>

      <div className="px-3 md:px-8 py-8 pt-28">
        <div className="mx-auto max-w-5xl">
          {/* HEADER */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-6xl font-black text-[#2b290f] mb-3">📋 {isParent ? "My Assignments" : "My Adventures"}</h1>
            <p className="text-2xl font-semibold text-[#615b36]">{isParent ? "Track all tasks for your children" : "Complete your tasks and earn stars!"}</p>
          </motion.div>

          {/* NO TASKS */}
          {allParentTasks.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="text-7xl mb-6">📝</div>
              <p className="text-3xl font-black text-[#2b290f] mb-3">{isParent ? "No Assignments Yet!" : "No Adventures Yet!"}</p>
              <p className="text-xl text-[#615b36] mb-8">{isParent ? "Go to Dashboard to create tasks" : "Check back soon for new tasks!"}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate("/Dashboard")}
                className="rounded-full bg-gradient-to-r from-[#f6b500] to-[#ff9800] px-12 py-4 font-black text-white"
              >
                ➕ Go to Dashboard
              </motion.button>
            </motion.div>
          )}

          {/* PARENT TASKS */}
          {isParent && allParentTasks.length > 0 && (
            <div className="space-y-8">
              {availableChildren.map((child) => {
                const childTasks = allParentTasks.filter(t => t.childUserId === child.userId);
                if (childTasks.length === 0) return null;

                const completed = childTasks.filter(t => t.completed).length;
                const total = childTasks.length;
                const percentage = Math.round((completed / total) * 100);

                return (
                  <motion.div key={child.userId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl shadow-lg overflow-hidden">
                    {/* CHILD HEADER */}
                    <div className="bg-gradient-to-r from-[#8fd4ff] to-[#85cbf2] p-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <span className="text-6xl">👧</span>
                          <div>
                            <h3 className="text-4xl font-black text-[#2b290f]">{child.name}</h3>
                            <p className="text-lg font-bold text-[#3b3a2a]">Age {child.age}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-black text-[#2b290f]">{completed}/{total}</p>
                          <p className="text-sm font-semibold text-[#3b3a2a]">Completed</p>
                        </div>
                      </div>

                      {/* PROGRESS */}
                      <div className="w-full h-4 bg-white/40 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-[#f6b500] to-[#3f8700]"
                        />
                      </div>
                      <p className="text-sm font-bold text-[#2b290f] mt-2">{percentage}% Complete</p>
                    </div>

                    {/* TASKS LIST */}
                    <div className="p-8">
                      <div className="space-y-4">
                        {/* Pending */}
                        {childTasks.filter(t => !t.completed).length > 0 && (
                          <div>
                            <h4 className="text-lg font-black text-[#2b290f] mb-3">📝 Pending</h4>
                            <div className="space-y-2">
                              {childTasks.filter(t => !t.completed).map((task) => {
                                const stickerInfo = getStickerInfo(task.sticker);
                                const Icon = stickerInfo?.icon;
                                return (
                                  <motion.div key={task.id} whileHover={{ scale: 1.02 }} className="flex items-center gap-3 p-3 bg-yellow-50 border-2 border-[#f5e499] rounded-lg group">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: stickerInfo?.color }}>
                                      {Icon && <Icon size={20} className="text-[#2b290f]" />}
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-bold text-[#2b290f]">{task.name}</p>
                                      <p className="text-xs text-[#615b36]">🕐 {task.time}</p>
                                    </div>
                                    <motion.button
                                      whileHover={{ scale: 1.2 }}
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100"
                                    >
                                      <Trash2 size={18} />
                                    </motion.button>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Completed */}
                        {childTasks.filter(t => t.completed).length > 0 && (
                          <div className="mt-6">
                            <h4 className="text-lg font-black text-[#2b290f] mb-3">✅ Completed</h4>
                            <div className="space-y-2">
                              {childTasks.filter(t => t.completed).map((task) => {
                                const stickerInfo = getStickerInfo(task.sticker);
                                const Icon = stickerInfo?.icon;
                                return (
                                  <motion.div key={task.id} className="flex items-center gap-3 p-3 bg-green-50 border-2 border-green-300 rounded-lg group">
                                    <div className="w-6 h-6 rounded-full bg-[#3b700a] flex items-center justify-center text-white text-sm font-bold">✓</div>
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center opacity-50" style={{ backgroundColor: stickerInfo?.color }}>
                                      {Icon && <Icon size={20} className="text-[#2b290f]" />}
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-bold text-[#2b290f] line-through opacity-60">{task.name}</p>
                                      <p className="text-xs text-[#615b36]">✓ Done at {task.completedAt}</p>
                                    </div>
                                    <motion.button
                                      whileHover={{ scale: 1.2 }}
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100"
                                    >
                                      <Trash2 size={18} />
                                    </motion.button>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* CHILD TASKS VIEW */}
          {!isParent && allParentTasks.length > 0 && (
            <div className="space-y-6 sm:space-y-8">
              {/* STATS CARD */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-r from-[#8fdd55] to-[#a8f258] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-white shadow-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-3 mb-4 sm:mb-6">
                  <div className="bg-white/20 backdrop-blur rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto text-center sm:text-left">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-black">{allParentTasks.filter(t => t.completed).length}/{allParentTasks.length}</p>
                    <p className="text-xs sm:text-sm font-bold">Tasks completed</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto text-center sm:text-left">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-black">{Math.round((allParentTasks.filter(t => t.completed).length / allParentTasks.length) * 100)}%</p>
                    <p className="text-xs sm:text-sm font-bold">Overall completion</p>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-2 sm:h-3 bg-white/30 rounded-full overflow-hidden mb-3 sm:mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((allParentTasks.filter(t => t.completed).length / allParentTasks.length) * 100)}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                <p className="text-base sm:text-lg font-black">Keep going! You're doing amazing! 💪</p>
              </motion.div>

              {/* TASKS GRID */}
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {allParentTasks.map((task) => {
                    const stickerInfo = getStickerInfo(task.category || task.sticker);
                    const Icon = stickerInfo?.icon;
                    const isCompleted = task.completed;
                    const taskName = task.title || task.name;
                    const taskTime = task.startTime || task.time;
                    const taskExtra = task.description || task.extra;
                    
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        className={`rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-lg border-2 relative group ${
                          isCompleted
                            ? "bg-gradient-to-br from-[#8fdd55] to-[#7dd347] border-[#6bc91f]"
                            : "bg-white border-[#f5e499]"
                        }`}
                      >
                        {/* DELETE BUTTON */}
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          onClick={() => handleDeleteTask(task.id)}
                          className={`absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full transition ${
                            isCompleted
                              ? "text-white/60 hover:text-white hover:bg-white/20"
                              : "text-red-400 hover:text-red-600 hover:bg-red-50"
                          }`}
                          title="Delete task"
                        >
                          <Trash2 size={18} className="sm:w-5 sm:h-5" />
                        </motion.button>

                        {/* STATUS BADGE */}
                        <div className="flex items-center justify-between mb-3 sm:mb-4 pr-8">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: stickerInfo?.color }}>
                            {Icon && <Icon size={16} className="sm:w-5 sm:h-5 text-[#2b290f]" />}
                          </div>
                          <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                            isCompleted 
                              ? "bg-white text-[#6bc91f]"
                              : "bg-[#f6b500] text-white"
                          }`}>
                            {isCompleted ? "✓ Done" : "⚡ Active"}
                          </span>
                        </div>

                        {/* TASK NAME */}
                        <h3 className={`text-lg sm:text-xl md:text-2xl font-black mb-3 sm:mb-4 line-clamp-2 ${isCompleted ? "text-white line-through opacity-75" : "text-[#2b290f]"}`}>
                          {taskName}
                        </h3>

                        {/* TASK DETAILS */}
                        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                          {task.category && (
                            <div className="flex items-center gap-2">
                              <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold whitespace-nowrap overflow-hidden text-ellipsis ${
                                isCompleted ? "bg-white/20 text-white" : "bg-[#fef3c7] text-[#92400e]"
                              }`}>
                                {task.category}
                              </span>
                            </div>
                          )}
                          {taskExtra && (
                            <p className={`text-xs sm:text-sm font-semibold line-clamp-2 ${isCompleted ? "text-white/80" : "text-[#615b36]"}`}>
                              💡 {taskExtra}
                            </p>
                          )}
                          {taskTime && (
                            <p className={`text-xs sm:text-sm font-bold ${isCompleted ? "text-white/80" : "text-[#615b36]"}`}>
                              🕐 {taskTime}
                            </p>
                          )}
                        </div>

                        {/* ACTION BUTTON */}
                        {!isCompleted ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleMarkComplete(task.id)}
                            className="w-full py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base text-center bg-[#f6b500] text-white hover:bg-[#f39d12] transition"
                          >
                            👉 Click to mark complete
                          </motion.button>
                        ) : (
                          <p className="text-center text-white font-bold text-xs sm:text-sm">
                            ✓ Amazing work! Keep it up! 💪
                          </p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Task;
