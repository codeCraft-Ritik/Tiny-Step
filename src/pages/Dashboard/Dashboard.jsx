import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CircleDot, Home, Menu, X, Plus, Trophy, Utensils, WandSparkles, LogOut, Shield, Trash2, CheckCircle2, Circle } from "lucide-react";
import Logo from "../../assets/Logo.png";
import Footer from "../../components/Footer";
import authAPI from "../../services/authAPI";
import SettingsModal from "./SettingsModal";
import AddActivityModal from "./AddActivityModal";

const menuItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "adventures", label: "Adventures", icon: CircleDot, route: "/task" },
  { id: "families", label: "Family Board", icon: Trophy, route: "/friends" },
  { id: "parent-dashboard", label: "Parent Dashboard", icon: Shield, route: "/parent-dashboard" }
];

const scheduleItems = [
  {
    title: "Healthy Breakfast",
    subtitle: "Oatmeal & Berries",
    note: "COMPLETED",
    color: "#f5b301",
    icon: Utensils,
    button: null
  },
];

const ActivityCategoryEmojis = {
  play: "🎮",
  activity: "🏃",
  meal: "🍽️",
  learning: "📚",
  creative: "🎨",
  exercise: "⚽",
  sleep: "😴",
  other: "⭐",
};

function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("home");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [parentNames, setParentNames] = useState({ fatherName: "", motherName: "" });
  const [familyPhoto, setFamilyPhoto] = useState(null);
  const [childName, setChildName] = useState("Explorer");
  const navigate = useNavigate();

  // Load user points and parent names on mount
  useEffect(() => {
    try {
      const user = authAPI.getUser();
      if (user && user.id) {
        const userKey = `userProfile_${user.id}`;
        const userProfile = localStorage.getItem(userKey);
        if (userProfile) {
          const profile = JSON.parse(userProfile);
          setUserPoints(profile.points || 0);
          // Load parent names
          setParentNames({
            fatherName: profile.fatherName || "",
            motherName: profile.motherName || ""
          });
          // Load family photo
          if (profile.profilePicture) {
            setFamilyPhoto(profile.profilePicture);
          }
          // Load all children's names for the schedule heading
          if (profile.children && profile.children.length > 0) {
            const childrenNames = profile.children
              .map(child => child.name)
              .filter(name => name)
              .join(" & ");
            setChildName(childrenNames || "Explorer");
          }
          console.log("✅ Parent names loaded:", { fatherName: profile.fatherName, motherName: profile.motherName });
        }
      }
    } catch (error) {
      console.error("Error loading user points:", error);
    }
  }, []);

  // Load activities from localStorage on mount
  useEffect(() => {
    const savedActivities = localStorage.getItem("dailyActivities");
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, []);

  // Save activities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("dailyActivities", JSON.stringify(activities));
  }, [activities]);

  const handleAddActivity = (newActivity) => {
    console.log("📝 New activity received:", newActivity);
    
    // Add to activities list
    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);
    
    // If activity is assigned to a specific child, save it to child-specific key
    if (newActivity.childName) {
      // Use childName as the key to match what the child will look for
      const childTasksKey = `childTasks_${newActivity.childName}`;
      console.log("💾 Saving task to key:", childTasksKey);
      
      const existingTasks = localStorage.getItem(childTasksKey);
      const childTasks = existingTasks ? JSON.parse(existingTasks) : [];
      console.log("📊 Existing tasks count:", childTasks.length);
      
      // Add new activity to child's task list
      const updatedChildTasks = [...childTasks, newActivity];
      localStorage.setItem(childTasksKey, JSON.stringify(updatedChildTasks));
      console.log("✅ Task saved successfully - Total tasks now:", updatedChildTasks.length);
    } else {
      console.warn("⚠️ WARNING: Task has no childName!", newActivity);
    }
  };

  const handleToggleActivity = (id) => {
    const updatedActivities = activities.map((activity) =>
      activity.id === id ? { ...activity, completed: !activity.completed } : activity
    );
    setActivities(updatedActivities);
    
    // Update child-specific storage if this activity is for a specific child
    const changedActivity = updatedActivities.find(a => a.id === id);
    if (changedActivity && changedActivity.childName) {
      const childTasksKey = `childTasks_${changedActivity.childName}`;
      const existingTasks = localStorage.getItem(childTasksKey);
      if (existingTasks) {
        const childTasks = JSON.parse(existingTasks);
        const updatedChildTasks = childTasks.map(t =>
          t.id === id ? { ...t, completed: !t.completed } : t
        );
        localStorage.setItem(childTasksKey, JSON.stringify(updatedChildTasks));
      }
    }
  };

  const handleDeleteActivity = (id) => {
    // Find the activity before deleting
    const activityToDelete = activities.find(a => a.id === id);
    
    // Update main activities list
    const updatedActivities = activities.filter((activity) => activity.id !== id);
    setActivities(updatedActivities);
    
    // Update child-specific storage if applicable
    if (activityToDelete && activityToDelete.childName) {
      const childTasksKey = `childTasks_${activityToDelete.childName}`;
      const existingTasks = localStorage.getItem(childTasksKey);
      if (existingTasks) {
        const childTasks = JSON.parse(existingTasks);
        const updatedChildTasks = childTasks.filter(t => t.id !== id);
        localStorage.setItem(childTasksKey, JSON.stringify(updatedChildTasks));
        console.log(`✓ Task deleted for child "${activityToDelete.childName}"`);
      }
    }
  };

  const completedCount = activities.filter((a) => a.completed).length;
  const totalActivities = activities.length;

  const handleLogout = async () => {
    try {
      const token = authAPI.getToken();
      if (token) {
        await authAPI.logout(token);
      }
      authAPI.clearAuth();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      authAPI.clearAuth();
      navigate("/");
    }
  };

  // Render Menu Items
  const renderMenuItems = (onItemClick) => (
    <>
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeMenu === item.id;

        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.route) {
                navigate(item.route);
                onItemClick?.();
              } else if (item.isSpecial) {
                navigate("/Celebration");
                onItemClick?.();
              } else {
                setActiveMenu(item.id);
                onItemClick?.();
              }
            }}
            className={[
              "flex w-full items-center gap-2 sm:gap-3 rounded-full px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold transition",
              isActive
                ? "bg-[#f6b500] text-white shadow-[0_5px_0_#df9f00]"
                : "text-[#2f2a13] hover:bg-[#e7debb]"
            ].join(" ")}
          >
            <Icon size={16} className="flex-shrink-0" />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </>
  );

  // Render Action Buttons
  const renderActionButtons = (onActionClick) => (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          navigate("/task");
          onActionClick?.();
        }}
        className="w-full rounded-full bg-gradient-to-r from-[#f5b301] to-[#ffcc33] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-extrabold text-[#3c2d00] shadow-[0_5px_0_#df9f00] hover:translate-y-0.5 transition flex items-center justify-center gap-2"
      >
        🚀 Start Journey
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsAddActivityOpen(true);
          onActionClick?.();
        }}
        className="w-full rounded-full bg-gradient-to-r from-[#10b981] to-[#34d399] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-extrabold text-white shadow-[0_5px_0_#059669] hover:translate-y-0.5 transition flex items-center justify-center gap-2"
      >
        <Plus size={16} className="flex-shrink-0" />
        <span className="truncate">Add Task</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          handleLogout();
          onActionClick?.();
        }}
        className="w-full rounded-full bg-[#ff6b6b] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-extrabold text-white shadow-[0_5px_0_#ee5a52] hover:translate-y-0.5 transition flex items-center justify-center gap-2"
      >
        <LogOut size={16} className="flex-shrink-0" />
        <span className="truncate">Logout</span>
      </motion.button>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#ece9ef]">
      {/* Modals */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <AddActivityModal
        isOpen={isAddActivityOpen}
        onClose={() => setIsAddActivityOpen(false)}
        onAdd={handleAddActivity}
      />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-64 sm:w-72 md:w-80 bg-[#efe9ce] z-50 lg:hidden rounded-r-[20px] sm:rounded-r-[30px] shadow-lg p-4 sm:p-5 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-2xl font-black text-[#2f2a13]">Menu</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-[#e7debb] rounded-full transition flex-shrink-0"
              >
                <X size={20} className="text-[#2f2a13] sm:w-6 sm:h-6" />
              </motion.button>
            </div>

            <div className="mb-6">
              <div className="mb-3 inline-flex rounded-2xl bg-[#8fd4ff] p-3 sm:p-4 shadow-[inset_0_0_0_2px_#d8f0ff]">
                {familyPhoto ? (
                  <img
                    src={familyPhoto}
                    alt="Family Photo"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover"
                  />
                ) : (
                  <span className="text-2xl sm:text-3xl">🧒</span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#2f2a13]">
                {parentNames.fatherName || parentNames.motherName
                  ? `Hi ${parentNames.fatherName}${parentNames.fatherName && parentNames.motherName ? " & " : ""}${parentNames.motherName}!`
                  : "Hi Explorer!"}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-[#5f5a42]">Ready to play?</p>
            </div>

            <nav className="space-y-1 sm:space-y-1.5 mb-6">
              {renderMenuItems(() => setIsMobileMenuOpen(false))}
            </nav>

            <div className="space-y-1 sm:space-y-1.5">
              {renderActionButtons(() => setIsMobileMenuOpen(false))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 px-2 py-2 sm:px-3 sm:py-3 md:px-5 md:py-4 lg:px-8 lg:py-6">
        <div className="mx-auto w-full gap-2 sm:gap-4 md:gap-6 lg:grid lg:grid-cols-[240px_1fr]">
        {/* Sidebar - Hidden on mobile, shown on large screens */}
        <aside className="hidden lg:block rounded-[30px] bg-[#efe9ce] p-5 shadow-[0_10px_25px_rgba(0,0,0,0.08)] h-fit">
          <div className="mb-4">
            <div className="mb-3 inline-flex rounded-2xl bg-[#8fd4ff] p-4 shadow-[inset_0_0_0_2px_#d8f0ff]">
              {familyPhoto ? (
                <img
                  src={familyPhoto}
                  alt="Family Photo"
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <span className="text-3xl">🧒</span>
              )}
            </div>
            <h2 className="text-[26px] leading-8 font-black text-[#2f2a13] md:text-[30px]">
              {parentNames.fatherName || parentNames.motherName
                ? `Hi ${parentNames.fatherName}${parentNames.fatherName && parentNames.motherName ? " & " : ""}${parentNames.motherName}!`
                : "Hi Explorer!"}
            </h2>
            <p className="mt-1 text-base font-medium text-[#5f5a42]">Ready to play?</p>
          </div>

          <nav className="space-y-1.5">
            {renderMenuItems()}
          </nav>

          <div className="mt-4 space-y-1.5">
            {renderActionButtons()}
          </div>
        </aside>

        <main className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-7">
          <header className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-1 rounded-full bg-[#efe9d8] text-[#57502f] hover:bg-[#e0d8c8] transition flex-shrink-0"
            >
              <Menu size={20} />
            </motion.button>

            {/* Title - Responsive */}
            <div className="flex-1 min-w-0 flex items-center gap-2 sm:gap-3">
              <motion.img
                src={Logo}
                alt="TinySteps"
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="hidden sm:block w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex-shrink-0"
              />
              <h1 className="text-[clamp(20px,5vw,36px)] leading-tight font-black italic text-[#2b290f]">TinySteps</h1>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1.5 sm:gap-2 items-center flex-shrink-0">
              {/* Points Display */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden sm:flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-[#f5d66f] shadow"
              >
                <span className="text-lg">⭐</span>
                <span className="font-bold text-[#6b5300] text-sm md:text-base">{userPoints}</span>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSettingsOpen(true)}
                className="grid h-9 sm:h-10 md:h-12 w-9 sm:w-10 md:w-12 place-items-center rounded-full bg-[#efe9d8] text-[#57502f] shadow hover:bg-[#e0d8c8] transition text-lg sm:text-xl flex-shrink-0"
              >
                ⚙️
              </motion.button>
            </div>
          </header>

          {/* Progress Section */}
          <section className="grid grid-cols-1 gap-2 sm:gap-3 md:gap-4 lg:gap-4 lg:grid-cols-[1fr_220px]">
            <motion.article
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[24px] sm:rounded-[30px] bg-[#aff260] p-3 sm:p-4 md:p-5 shadow-[0_8px_16px_rgba(0,0,0,0.1)]"
            >
              <div className="flex flex-col gap-2 sm:gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h2 className="text-[clamp(18px,4vw,32px)] leading-snug font-black text-[#2e4d00]">Adventure Progress</h2>
                    <p className="mt-1 text-[clamp(12px,2.5vw,18px)] font-semibold text-[#3f570d]">
                      {completedCount}/{totalActivities > 0 ? totalActivities + 4 : 4} activities!
                    </p>
                  </div>
                  <div className="grid h-12 sm:h-14 w-12 sm:w-14 place-items-center rounded-xl sm:rounded-2xl bg-white text-[#407000] text-2xl sm:text-3xl flex-shrink-0">
                    🚀
                  </div>
                </div>

                <div className="h-4 sm:h-5 rounded-full bg-white/70 p-0.5 sm:p-0.75">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: totalActivities > 0 ? `${(completedCount / (totalActivities + 4)) * 100}%` : "50%" }}
                    transition={{ duration: 0.6 }}
                    className="h-full rounded-full bg-[#3e7900] bg-[linear-gradient(110deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0.2)_100%)]"
                  />
                </div>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              onClick={() => navigate("/rewards")}
              className="rounded-[24px] sm:rounded-[30px] bg-[#8fd4ff] p-3 sm:p-4 md:p-5 shadow-[0_8px_16px_rgba(0,0,0,0.1)] cursor-pointer hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] transition transform hover:-translate-y-1"
            >
              <h3 className="mb-2 sm:mb-3 flex items-center gap-2 text-[clamp(16px,3.5vw,24px)] leading-snug font-black text-[#103e57]">
                🏆 My Rewards
              </h3>
              <div className="grid grid-cols-3 gap-1.5">
                <div className="grid h-9 sm:h-10 place-items-center rounded-lg sm:rounded-xl bg-white text-sm sm:text-base font-bold">★</div>
                <div className="grid h-9 sm:h-10 place-items-center rounded-lg sm:rounded-xl bg-[#b9e7ff] text-sm sm:text-base font-bold">🏆</div>
                <div className="grid h-9 sm:h-10 place-items-center rounded-lg sm:rounded-xl bg-white text-sm sm:text-base font-bold">✨</div>
              </div>
              <p className="mt-2 text-[10px] sm:text-xs font-black tracking-[0.06em] text-[#114762]">Tap to view all rewards →</p>
            </motion.article>
          </section>

          {/* Daily Activities Checklist Section */}
          {activities.length > 0 && (
            <section>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[24px] sm:rounded-[30px] bg-white p-3 sm:p-4 md:p-5 shadow-[0_8px_16px_rgba(0,0,0,0.1)]"
              >
                <h2 className="mb-3 text-[clamp(18px,4vw,28px)] leading-snug font-black text-[#2b290f]">
                  📋 Today's Activities
                </h2>
                <div className="space-y-1.5 sm:space-y-2">
                  {activities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border-2 transition ${
                        activity.completed
                          ? "bg-[#dfefd0] border-[#3b700a]/30"
                          : "bg-[#f9f6f0] border-[#f5e499]"
                      }`}
                    >
                      {/* Checkbox */}
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggleActivity(activity.id)}
                        className="flex-shrink-0 mt-0.5"
                      >
                        {activity.completed ? (
                          <CheckCircle2 size={20} className="text-[#3b700a]" />
                        ) : (
                          <Circle size={20} className="text-[#999]" />
                        )}
                      </motion.button>

                      {/* Activity Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-lg sm:text-xl flex-shrink-0">
                            {ActivityCategoryEmojis[activity.category] || "⭐"}
                          </span>
                          <h3
                            className={`font-bold text-[clamp(13px,3vw,16px)] break-words ${
                              activity.completed
                                ? "line-through text-[#666] opacity-60"
                                : "text-[#2c3e50]"
                            }`}
                          >
                            {activity.title}
                          </h3>
                        </div>

                        {activity.childName && (
                          <p className="text-[10px] sm:text-xs font-semibold text-[#0d7a9d] mt-0.5 sm:mt-1 ml-6 bg-[#e9f7ff] px-1.5 py-0.5 rounded inline-block">
                            👧 {activity.childName}
                          </p>
                        )}

                        {activity.description && (
                          <p className="text-xs sm:text-sm text-[#666] mt-0.5 sm:mt-1 ml-6 line-clamp-2">
                            {activity.description}
                          </p>
                        )}

                        {(activity.startTime || activity.endTime) && (
                          <p className="text-[10px] sm:text-xs text-[#999] mt-0.5 ml-6">
                            ⏰ {activity.startTime} {activity.endTime ? `- ${activity.endTime}` : ""}
                          </p>
                        )}
                      </div>

                      {/* Delete Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteActivity(activity.id)}
                        className="flex-shrink-0 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>

                {/* Summary Stats */}
                {activities.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-3 p-2.5 sm:p-3 rounded-lg bg-[#f0f8ff] border-2 border-[#85cbf2]"
                  >
                    <p className="text-[11px] sm:text-sm font-bold text-[#0d7a9d]">
                      ✅ {completedCount} of {activities.length} completed
                      {completedCount === activities.length && " - Amazing! 🎉"}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </section>
          )}

          {/* Schedule Section */}
          <section>
            <h2 className="mb-2 sm:mb-3 text-[clamp(18px,4vw,32px)] leading-snug font-black text-[#2b290f]">{childName}'s Daily Schedule</h2>
            <div className="grid grid-cols-1 gap-2 sm:gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
              {scheduleItems.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + index * 0.05 }}
                  className="rounded-[20px] sm:rounded-[26px] bg-[#efe9ce] p-3 sm:p-4 shadow-[0_6px_12px_rgba(0,0,0,0.08)]"
                >
                  <div
                    className="mb-2 sm:mb-3 inline-grid h-10 sm:h-12 w-10 sm:w-12 place-items-center rounded-lg sm:rounded-xl text-lg sm:text-2xl"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.icon === "cap" ? (
                      <span>🎓</span>
                    ) : (
                      <item.icon size={20} />
                    )}
                  </div>
                  <h3 className="text-[clamp(14px,3vw,20px)] leading-snug font-black text-[#2d2b14]">{item.title}</h3>
                  <p className="mt-0.5 sm:mt-1 text-[clamp(11px,2.5vw,14px)] font-semibold text-[#6a6343]">{item.subtitle}</p>

                  {item.button ? (
                    <button className={["mt-2.5 sm:mt-3 w-full rounded-full px-3 py-2 text-[10px] sm:text-xs font-extrabold transition hover:-translate-y-0.5", item.button.className].join(" ")}>
                      {item.button.label}
                    </button>
                  ) : (
                    <p className="mt-2.5 sm:mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#dfefd0] px-2 py-1 text-[9px] sm:text-xs font-black text-[#3b700a]">
                      <span className="grid h-3 w-3 place-items-center rounded-full bg-[#3b700a] text-[6px] sm:text-[7px] text-white">✓</span>
                      {item.note}
                    </p>
                  )}
                </motion.article>
              ))}
            </div>
          </section>

          {/* Parent's Corner Section */}
          <section className="relative overflow-hidden rounded-[24px] sm:rounded-[30px] bg-[#ece5a7] p-3 sm:p-4 md:p-5 shadow-[0_8px_16px_rgba(0,0,0,0.08)]">
            <div className="grid grid-cols-1 gap-2 sm:gap-3 md:gap-4">
              <div className="flex gap-2 sm:gap-3">
                <div className="grid h-12 sm:h-14 w-12 sm:w-14 place-items-center rounded-2xl sm:rounded-3xl bg-[#f6b500] text-lg sm:text-2xl text-white flex-shrink-0">🧩</div>
                <div className="flex-1">
                  <h3 className="text-[clamp(16px,3.5vw,28px)] leading-snug font-black italic text-[#2e2b13]">Parent's Corner</h3>
                  <p className="mt-1 text-[clamp(12px,2.5vw,16px)] leading-[1.3] font-semibold text-[#575334]">
                    "Research shows creative tasks boost problem-solving by 30%—but the real breakthrough is watching your child's confidence soar with every creation. 🎨✨"
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full bg-white/80 px-2 py-1 text-[9px] sm:text-xs font-black tracking-[0.05em] text-[#9f7300]">LEARNING</span>
                <span className="rounded-full bg-[#e9f7ff] px-2 py-1 text-[9px] sm:text-xs font-black tracking-[0.05em] text-[#0f6b95]">CREATIVITY</span>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-4 -bottom-4 h-16 w-16 rounded-full bg-[#d6d089] sm:-right-6 sm:-bottom-6 sm:h-24 sm:w-24" />
          </section>
        </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;
