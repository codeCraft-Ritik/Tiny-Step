import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, TrendingUp, Bell, Users, CheckCircle, AlertCircle, BarChart3, Watch, Clock, ArrowLeft, LogOut, Shield, Trash2, Edit2, Plus, Save, X as CloseIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import Footer from "../components/Footer";
import authAPI from "../services/authAPI";
import familyAPI from "../services/familyAPI";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [parentId, setParentId] = useState(null);
  const [parentProfile, setParentProfile] = useState(null);
  const [childrenData, setChildrenData] = useState([]);
  const [allChildTasks, setAllChildTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(null);
  
  // Family Management State
  const [familyData, setFamilyData] = useState({
    fatherName: "",
    motherName: "",
    familyChildren: []
  });
  const [newChildName, setNewChildName] = useState("");
  const [newChildAge, setNewChildAge] = useState("");
  const [isFamilyEditMode, setIsFamilyEditMode] = useState(false);
  const [familyErrors, setFamilyErrors] = useState({});
  const [familySuccessMessage, setFamilySuccessMessage] = useState("");
  const [savingFamily, setSavingFamily] = useState(false);

  // Task Creation State
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("activity");
  const [taskChildId, setTaskChildId] = useState(""); // Explicitly select child for task
  const [taskSuccess, setTaskSuccess] = useState("");

  // Get parent user on mount
  useEffect(() => {
    try {
      const user = authAPI.getUser();
      if (user && user.id) {
        setParentId(user.id);
        
        // Load parent profile information
        const parentProfileKey = `userProfile_${user.id}`;
        const savedProfile = localStorage.getItem(parentProfileKey);
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          setParentProfile(profile);
          console.log("Parent profile loaded:", profile);
        }
        
        // Load family data from database
        loadFamilyData(user.id);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error getting user:", error);
      navigate("/");
    }
  }, [navigate]);

  // Load family data from database
  const loadFamilyData = async (userId) => {
    try {
      const token = authAPI.getToken();
      if (token) {
        try {
          const response = await familyAPI.getFamilyInfo(token);
          if (response && response.family) {
            setFamilyData({
              fatherName: response.family.fatherName || "",
              motherName: response.family.motherName || "",
              familyChildren: response.family.children || []
            });
            console.log("✅ Family data loaded from database");
          }
        } catch (error) {
          console.log("Database load failed, using localStorage:", error);
          // Fallback to localStorage
          const userKey = `userProfile_${userId}`;
          const userProfile = localStorage.getItem(userKey);
          if (userProfile) {
            const profile = JSON.parse(userProfile);
            setFamilyData({
              fatherName: profile.fatherName || "",
              motherName: profile.motherName || "",
              familyChildren: profile.children || []
            });
          }
        }
      }
    } catch (error) {
      console.error("Error loading family data:", error);
    }
  };

  // Load children data and their tasks
  useEffect(() => {
    if (parentId) {
      try {
        loadChildrenAndTasks();
      } catch (error) {
        console.error("Error loading children data:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [parentId]);

  // Save family data to database and localStorage
  const saveFamilyData = async (updatedFamilyData) => {
    if (!parentId) return;
    setSavingFamily(true);
    
    try {
      const token = authAPI.getToken();
      
      // Save to database if token exists
      if (token) {
        try {
          await familyAPI.saveFamilyInfo(token, {
            fatherName: updatedFamilyData.fatherName,
            motherName: updatedFamilyData.motherName,
            children: updatedFamilyData.familyChildren,
          });
          console.log("✅ Family data saved to database");
        } catch (error) {
          console.error("Error saving to database:", error);
          // Continue to save to localStorage even if database fails
        }
      }

      // Also save to localStorage for offline support
      const userKey = `userProfile_${parentId}`;
      const existingProfile = localStorage.getItem(userKey);
      const profile = existingProfile ? JSON.parse(existingProfile) : {};

      const updatedProfile = {
        ...profile,
        fatherName: updatedFamilyData.fatherName,
        motherName: updatedFamilyData.motherName,
        children: updatedFamilyData.familyChildren,
        lastUpdated: new Date().toLocaleString(),
      };

      localStorage.setItem(userKey, JSON.stringify(updatedProfile));
      console.log("✅ Updated profile saved to localStorage:", {
        key: userKey,
        childrenCount: updatedFamilyData.familyChildren.length,
        children: updatedFamilyData.familyChildren
      });
      setFamilyData(updatedFamilyData);
      setFamilySuccessMessage("✓ Family information saved successfully!");
      setTimeout(() => setFamilySuccessMessage(""), 3000);
      setIsFamilyEditMode(false);
    } catch (error) {
      console.error("Error saving family data:", error);
      setFamilyErrors({ general: "Failed to save family information" });
    } finally {
      setSavingFamily(false);
    }
  };

  // Handle add child
  const handleAddChild = () => {
    const newErrors = {};
    if (!newChildName.trim()) {
      newErrors.childName = "Child name is required";
    }
    if (!newChildAge || newChildAge < 0 || newChildAge > 18) {
      newErrors.childAge = "Child age must be between 0-18";
    }

    if (Object.keys(newErrors).length > 0) {
      setFamilyErrors(newErrors);
      return;
    }

    // Check if child name already exists
    if (familyData.familyChildren.some(child => child.name.toLowerCase() === newChildName.trim().toLowerCase())) {
      setFamilyErrors({ childName: "This child name is already added" });
      return;
    }

    const newChild = {
      id: Date.now().toString(),
      name: newChildName.trim(),
      age: parseInt(newChildAge),
    };

    const updatedFamily = {
      ...familyData,
      familyChildren: [...familyData.familyChildren, newChild],
    };

    saveFamilyData(updatedFamily);
    setNewChildName("");
    setNewChildAge("");
    setFamilyErrors({});
  };

  // Handle remove child
  const handleRemoveChild = (childId) => {
    const updatedFamily = {
      ...familyData,
      familyChildren: familyData.familyChildren.filter((child) => child.id !== childId),
    };
    saveFamilyData(updatedFamily);
  };

  // Handle add task for selected child
  const handleAddTaskForChild = (e) => {
    e.preventDefault();
    
    if (!newTaskTitle.trim()) {
      alert("Please enter a task title");
      return;
    }
    
    if (!taskChildId) {
      alert("❌ Please select a child first!");
      return;
    }

    // Find the child object
    const selectedChild = combinedChildren.find(c => c.userId === taskChildId);
    if (!selectedChild) {
      alert("Invalid child selection");
      return;
    }

    const childName = selectedChild.name;
    const childTasksKey = `childTasks_${childName}`;
    
    // Create task object
    const newTask = {
      id: `task_${Date.now()}`,
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      category: newTaskCategory,
      childName: childName,
      childId: selectedChild.userId,
      completed: false,
      completedAt: null,
      createdAt: new Date().toLocaleString(),
    };

    // Get existing tasks from localStorage
    const existingTasksJson = localStorage.getItem(childTasksKey);
    const existingTasks = existingTasksJson ? JSON.parse(existingTasksJson) : [];

    // Add new task
    const updatedTasks = [...existingTasks, newTask];
    
    // Save to localStorage
    localStorage.setItem(childTasksKey, JSON.stringify(updatedTasks));

    console.log(`✅ Task "${newTaskTitle}" saved for child "${childName}"`);
    console.log(`📦 Stored in key: ${childTasksKey}`);
    console.log(`📊 Total tasks for ${childName}: ${updatedTasks.length}`);

    // Show success message
    setTaskSuccess(`✓ Task "${newTaskTitle}" added for ${childName}!`);
    setTimeout(() => setTaskSuccess(""), 3000);

    // Reset form
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskCategory("activity");
    setTaskChildId(""); // Reset child selection
  };

  // Handle parent name update
  const handleParentNameChange = (parent, value) => {
    setFamilyData(prev => ({
      ...prev,
      [parent]: value
    }));
  };

  // Handle save parent names
  const handleSaveParentNames = () => {
    const newErrors = {};
    if (!familyData.fatherName.trim()) newErrors.fatherName = "Father's name is required";
    if (!familyData.motherName.trim()) newErrors.motherName = "Mother's name is required";

    if (Object.keys(newErrors).length > 0) {
      setFamilyErrors(newErrors);
      return;
    }

    saveFamilyData(familyData);
  };

  const loadChildrenAndTasks = () => {
    try {
      const children = [];
      const allTasks = [];

      // Scan localStorage for all profiles
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        // Find child profiles linked to this parent
        if (key && key.startsWith("userProfile_")) {
          const profileData = JSON.parse(localStorage.getItem(key));
          const userId = profileData.userId;

          // Check if this user is a child of current parent (exclude parent's own profile)
          if (userId !== parentId && (profileData.parentId === parentId || (profileData.role === 'child' && profileData.familyId === parentId))) {
            // Get proper name for child - prefer fullName, firstName+lastName, or email username
            let childName = profileData.fullName || profileData.userName;
            
            if (!childName && (profileData.firstName || profileData.lastName)) {
              const firstName = profileData.firstName || "";
              const lastName = profileData.lastName || "";
              childName = `${firstName} ${lastName}`.trim();
            }
            
            if (!childName) {
              childName = profileData.email?.split('@')[0] || `Child_${userId}`;
            }
            
            children.push({
              userId: userId,
              name: childName,
              email: profileData.email || "No email",
              role: profileData.role || 'child',
              points: profileData.points || 0,
              tasksCompleted: profileData.tasksCompleted || 0,
              createdAt: profileData.createdAt || new Date().toLocaleDateString(),
              lastUpdated: profileData.lastUpdated || "Never",
              familyName: profileData.familyName || "Family"
            });

            // Get this child's tasks
            const tasksKey = `childTasks_${userId}`;
            const tasksData = localStorage.getItem(tasksKey);
            if (tasksData) {
              try {
                const tasks = JSON.parse(tasksData);
                const completedTasks = tasks.filter(t => t.completed);
                const pendingTasks = tasks.filter(t => !t.completed);

                // Get proper name for child - prefer fullName, firstName+lastName, or email username
                let taskChildName = profileData.fullName || profileData.userName;
                
                if (!taskChildName && (profileData.firstName || profileData.lastName)) {
                  const firstName = profileData.firstName || "";
                  const lastName = profileData.lastName || "";
                  taskChildName = `${firstName} ${lastName}`.trim();
                }
                
                if (!taskChildName) {
                  taskChildName = profileData.email?.split('@')[0] || `Child_${userId}`;
                }

                allTasks.push({
                  childId: userId,
                  childName: taskChildName,
                  tasks: tasks,
                  completed: completedTasks,
                  pending: pendingTasks,
                  completionRate: tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0
                });
              } catch (error) {
                console.error(`Error parsing tasks for ${userId}:`, error);
              }
            }
          }
        }
      }

      setChildrenData(children);
      setAllChildTasks(allTasks);

      if (children.length > 0) {
        setSelectedChild(children[0].userId);
      }
    } catch (error) {
      console.error("Error loading children and tasks:", error);
    }
  };

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

  // Calculate overall statistics
  const totalTasksCompleted = childrenData.reduce((sum, child) => sum + child.tasksCompleted, 0);
  const totalPoints = childrenData.reduce((sum, child) => sum + child.points, 0);
  const avgRoutineCompletion = childrenData.length > 0 ? Math.round(allChildTasks.reduce((sum, ct) => sum + ct.completionRate, 0) / allChildTasks.length) : 0;

  // Create combined children list (registered users + family-defined children)
  const combinedChildren = [
    // Filter childrenData to only include properly registered children with valid emails
    ...childrenData.filter(child => 
      child.email && 
      child.email !== "No email" && 
      child.email !== "Family Member" &&
      child.name && 
      child.name.trim() !== '' && 
      child.name !== 'User' && // Exclude generic "User" placeholder
      !child.name.match(/^[a-f0-9]{24}$/) // Exclude MongoDB ObjectIds
    ),
    ...familyData.familyChildren
      .filter(familyChild => !childrenData.some(child => child.name === familyChild.name))
      .map(familyChild => ({
        userId: familyChild.id,
        name: familyChild.name,
        age: familyChild.age,
        email: "Family Member",
        role: 'child',
        points: 0,
        tasksCompleted: 0,
        createdAt: new Date().toLocaleDateString(),
        lastUpdated: "Never",
        familyName: "Family",
        isFamilyChild: true // Flag to identify family-defined children
      }))
  ];

  // Set first child as selected if none selected
  useEffect(() => {
    if (combinedChildren.length > 0 && !selectedChild) {
      setSelectedChild(combinedChildren[0].userId);
    }
  }, [combinedChildren, selectedChild]);

  // Get selected child's tasks
  const selectedChildTasks = allChildTasks.find(ct => ct.childId === selectedChild);
  const selectedChildProfile = combinedChildren.find(c => c.userId === selectedChild);

  // Get upcoming/pending tasks
  const upcomingTasks = selectedChildTasks?.pending?.slice(0, 5) || [];

  // Get recent completed tasks
  const recentCompletedTasks = selectedChildTasks?.completed?.sort((a, b) => {
    const dateA = new Date(a.completedAt || 0);
    const dateB = new Date(b.completedAt || 0);
    return dateB - dateA;
  }).slice(0, 5) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fef9e7] to-[#f5f1e0] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center"
        >
          <p className="text-[24px] font-black text-[#2b290f] mb-4">Loading parent dashboard...</p>
          <div className="text-5xl">👨‍👩‍👧‍👦</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef9e7] to-[#f5f1e0] pb-20">
      {/* Header */}
      <nav className="bg-white shadow-md border-b border-[#d8d3be] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
            >
              <ArrowLeft className="w-5 sm:w-6 h-5 sm:h-6 text-[#2b290f]" />
            </motion.button>
            <img src={Logo} alt="TinySteps" className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg flex-shrink-0" />
            <h1 className="text-lg sm:text-2xl font-bold text-[#2c3e50] truncate">
              Tiny<span className="text-[#f2a61c]">Steps</span>
            </h1>
            <span className="hidden sm:inline text-xs bg-[#f2a61c]/20 text-[#f2a61c] px-3 py-1 rounded-full font-semibold">Parent Dashboard</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition relative" title="Notifications">
              <Bell className="w-5 sm:w-6 h-5 sm:h-6 text-[#666]" />
              {recentCompletedTasks.length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-1.5 sm:p-2 hover:bg-red-100 rounded-lg transition flex items-center gap-2"
              title="Logout"
            >
              <LogOut className="w-5 sm:w-6 h-5 sm:h-6 text-red-600" />
              <span className="hidden sm:inline text-xs font-bold text-red-600">Logout</span>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-[clamp(24px,6vw,48px)] font-bold text-[#2c3e50] mb-2">Welcome Back, Parent! 👋</h2>
          <p className="text-[#666] text-[clamp(14px,3vw,18px)]">Monitor your children's progress and tasks - real-time updates</p>
        </motion.div>

        {/* Family Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6 sm:mb-8 bg-gradient-to-br from-[#fff9e6] to-[#ffe8cc] rounded-xl sm:rounded-2xl p-4 sm:p-8 border-2 border-[#f2a61c]/30 shadow-md"
        >
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">👨‍👩‍👧‍👦</span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#2c3e50]">Family Management</h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFamilyEditMode(!isFamilyEditMode)}
              className={`p-2 rounded-lg transition flex items-center gap-2 ${
                isFamilyEditMode
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-[#f2a61c] text-white hover:bg-[#df9f00]"
              }`}
            >
              {isFamilyEditMode ? (
                <>
                  <CloseIcon size={18} />
                  <span className="text-sm font-bold">Cancel</span>
                </>
              ) : (
                <>
                  <Edit2 size={18} />
                  <span className="text-sm font-bold">Edit</span>
                </>
              )}
            </motion.button>
          </div>

          {familySuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-100 border-2 border-green-400 rounded-lg text-green-700 font-semibold text-sm"
            >
              {familySuccessMessage}
            </motion.div>
          )}

          {isFamilyEditMode ? (
            <div className="space-y-6">
              {/* Parent Names Section */}
              <div className="bg-white rounded-xl p-5 border-2 border-[#f5e499]">
                <h4 className="font-bold text-[#2c3e50] mb-4 flex items-center gap-2">
                  <span className="text-2xl">👨‍👩</span> Parent Names
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#2c3e50] mb-2">👨 Father's Name</label>
                    <input
                      type="text"
                      value={familyData.fatherName}
                      onChange={(e) => handleParentNameChange("fatherName", e.target.value)}
                      placeholder="Enter father's name"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                        familyErrors.fatherName
                          ? "border-red-500 focus:border-red-600"
                          : "border-[#f5e499] focus:border-[#f2a61c]"
                      } bg-[#fffacd]`}
                    />
                    {familyErrors.fatherName && (
                      <p className="text-red-600 text-xs font-semibold mt-1">❌ {familyErrors.fatherName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#2c3e50] mb-2">👩 Mother's Name</label>
                    <input
                      type="text"
                      value={familyData.motherName}
                      onChange={(e) => handleParentNameChange("motherName", e.target.value)}
                      placeholder="Enter mother's name"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                        familyErrors.motherName
                          ? "border-red-500 focus:border-red-600"
                          : "border-[#f5e499] focus:border-[#f2a61c]"
                      } bg-[#fffacd]`}
                    />
                    {familyErrors.motherName && (
                      <p className="text-red-600 text-xs font-semibold mt-1">❌ {familyErrors.motherName}</p>
                    )}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveParentNames}
                  disabled={savingFamily}
                  className="mt-4 w-full px-4 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-[#4caf50] to-[#45a049] hover:shadow-lg disabled:opacity-70 transition flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {savingFamily ? "Saving..." : "Save Parent Names"}
                </motion.button>
              </div>

              {/* Children Management Section */}
              <div className="bg-[#f0f8ff] rounded-xl p-5 border-2 border-[#85cbf2]">
                <h4 className="font-bold text-[#0d7a9d] mb-4 flex items-center gap-2">
                  <span className="text-2xl">👧👦</span> Children Information
                </h4>

                {/* Add Child Form */}
                <div className="mb-4 p-4 bg-white rounded-lg border-2 border-[#85cbf2]">
                  <p className="text-sm font-bold text-[#0d7a9d] mb-3">➕ Add New Child</p>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newChildName}
                      onChange={(e) => setNewChildName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddChild()}
                      placeholder="Child's name"
                      className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none text-sm transition ${
                        familyErrors.childName
                          ? "border-red-500"
                          : "border-[#85cbf2] focus:border-[#0d7a9d]"
                      } bg-white`}
                    />
                    <input
                      type="number"
                      value={newChildAge}
                      onChange={(e) => setNewChildAge(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddChild()}
                      placeholder="Age"
                      min="0"
                      max="18"
                      className={`w-20 px-3 py-2 border-2 rounded-lg focus:outline-none text-sm transition ${
                        familyErrors.childAge
                          ? "border-red-500"
                          : "border-[#85cbf2] focus:border-[#0d7a9d]"
                      } bg-white`}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddChild}
                      disabled={savingFamily}
                      className="px-4 py-2 rounded-lg font-bold text-white bg-[#0d7a9d] hover:bg-[#0a5f80] disabled:opacity-70 transition"
                    >
                      <Plus size={18} />
                    </motion.button>
                  </div>
                  {familyErrors.childName && (
                    <p className="text-red-600 text-xs font-semibold">❌ {familyErrors.childName}</p>
                  )}
                  {familyErrors.childAge && (
                    <p className="text-red-600 text-xs font-semibold">❌ {familyErrors.childAge}</p>
                  )}
                </div>

                {/* Children List */}
                {familyData.familyChildren.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-[#2c3e50]">
                      👧 {familyData.familyChildren.length} child{familyData.familyChildren.length !== 1 ? "ren" : ""} added
                    </p>
                    {familyData.familyChildren.map((child, idx) => (
                      <motion.div
                        key={child.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center justify-between bg-gradient-to-r from-[#dfefd0] to-[#e8f5e0] border-2 border-[#3b700a]/30 rounded-lg p-3 hover:shadow-md transition"
                      >
                        <div>
                          <p className="font-bold text-[#2c3e50]">👧 {child.name}</p>
                          <p className="text-xs text-[#666]">Age: {child.age} years</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveChild(child.id)}
                          disabled={savingFamily}
                          className="text-red-600 hover:text-red-700 font-bold p-2 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-[#666] text-sm">No children added yet</p>
                    <p className="text-xs text-[#999]">Add your children to track their progress</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Display Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Father's Name */}
                <div className="bg-white rounded-lg p-4 border-2 border-[#b3e5fc]">
                  <p className="text-xs font-bold text-[#666] mb-2">👨 Father</p>
                  <p className="text-lg font-bold text-[#2c3e50]">
                    {familyData.fatherName || <span className="text-[#999] italic">Not added yet</span>}
                  </p>
                </div>

                {/* Mother's Name */}
                <div className="bg-white rounded-lg p-4 border-2 border-[#f8bbd0]">
                  <p className="text-xs font-bold text-[#666] mb-2">👩 Mother</p>
                  <p className="text-lg font-bold text-[#2c3e50]">
                    {familyData.motherName || <span className="text-[#999] italic">Not added yet</span>}
                  </p>
                </div>
              </div>

              {/* Children Display */}
              {familyData.familyChildren.length > 0 && (
                <div className="border-t-2 border-[#f2a61c]/30 pt-6">
                  <p className="text-sm font-bold text-[#666] mb-3">
                    👧👦 Children ({familyData.familyChildren.length})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {familyData.familyChildren.map((child, idx) => (
                      <motion.div
                        key={child.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-lg p-3 border-2 border-[#9ce05f] flex items-center gap-3"
                      >
                        <span className="text-2xl">👧</span>
                        <div>
                          <p className="font-bold text-[#2c3e50]">{child.name}</p>
                          <p className="text-xs text-[#666]">Age: {child.age} years</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8"
        >
          {[
            { icon: "👶", label: "Active Children", value: combinedChildren.length, color: "from-blue-400 to-blue-600" },
            { icon: "✅", label: "Total Tasks Completed", value: totalTasksCompleted, color: "from-green-400 to-green-600" },
            { icon: "⭐", label: "Total Family Points", value: totalPoints, color: "from-purple-400 to-purple-600" },
            { icon: "📈", label: "Avg Completion Rate", value: `${avgRoutineCompletion}%`, color: "from-yellow-400 to-yellow-600" },
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className={`bg-gradient-to-br ${metric.color} rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg`}
            >
              <div className="text-3xl sm:text-4xl mb-2">{metric.icon}</div>
              <p className="text-white/80 text-xs sm:text-sm mb-1">{metric.label}</p>
              <p className="text-2xl sm:text-3xl font-bold">{metric.value}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
          {/* Children Selection & Tasks */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg border border-[#d8d3be]"
          >
            <div className="mb-6">
              <h3 className="text-lg sm:text-2xl font-bold text-[#2c3e50] mb-4">Select Child</h3>
              <div className="flex flex-wrap gap-2">
                {combinedChildren.length > 0 ? (
                  combinedChildren.map((child) => (
                    <motion.button
                      key={child.userId}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedChild(child.userId)}
                      className={`px-4 py-2 rounded-full font-bold text-sm transition ${
                        selectedChild === child.userId
                          ? "bg-[#f2a61c] text-white shadow-lg"
                          : "bg-gray-100 text-[#2c3e50] hover:bg-gray-200"
                      }`}
                    >
                      {child.isFamilyChild ? "👧" : "👤"} {child.name}
                    </motion.button>
                  ))
                ) : (
                  <p className="text-[#666] text-sm">No children added yet</p>
                )}
              </div>
            </div>

            {selectedChildProfile && (
              <>
                {/* Child Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-xs font-bold text-[#666]">Points</p>
                    <p className="text-2xl font-black text-[#f2a61c]">{selectedChildProfile.points}</p>
                  </div>
                  <div className="text-center border-l border-r border-gray-200">
                    <p className="text-xs font-bold text-[#666]">Tasks Done</p>
                    <p className="text-2xl font-black text-green-600">{selectedChildProfile.tasksCompleted}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-[#666]">Completion Rate</p>
                    <p className="text-2xl font-black text-[#7cc9f7]">{selectedChildTasks?.completionRate || 0}%</p>
                  </div>
                </div>

                {/* Add Task Form */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-2 border-orange-200"
                >
                  <h4 className="text-lg font-bold text-[#2c3e50] mb-3 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-orange-500" />
                    Add New Task
                  </h4>
                  
                  {taskSuccess && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-3 p-2 bg-green-100 border border-green-400 rounded text-green-700 font-semibold text-sm"
                    >
                      {taskSuccess}
                    </motion.div>
                  )}

                  <form onSubmit={handleAddTaskForChild} className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-[#2c3e50] mb-1">Select Child *</label>
                      <select
                        value={taskChildId}
                        onChange={(e) => setTaskChildId(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-orange-400 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                        required
                      >
                        <option value="">-- Choose a child --</option>
                        {combinedChildren.map((child) => (
                          <option key={child.userId} value={child.userId}>
                            👧 {child.name} {child.isFamilyChild ? `(Age: ${child.age})` : "(Registered)"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#2c3e50] mb-1">Task Title *</label>
                      <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="e.g., Read Books, Do Homework, Exercise"
                        className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#2c3e50] mb-1">Description</label>
                      <input
                        type="text"
                        value={newTaskDescription}
                        onChange={(e) => setNewTaskDescription(e.target.value)}
                        placeholder="Add details (optional)"
                        className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#2c3e50] mb-1">Category</label>
                      <select
                        value={newTaskCategory}
                        onChange={(e) => setNewTaskCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      >
                        <option value="activity">Activity</option>
                        <option value="learning">Learning</option>
                        <option value="exercise">Exercise</option>
                        <option value="meal">Meal Time</option>
                        <option value="creative">Creative</option>
                        <option value="play">Play & Learn</option>
                        <option value="sleep">Sleep Time</option>
                      </select>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-2 px-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-lg hover:from-orange-500 hover:to-orange-600 transition"
                    >
                      ➕ Add Task
                    </motion.button>
                  </form>
                </motion.div>

                {/* Upcoming Tasks */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-[#2c3e50] mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    Pending Tasks ({upcomingTasks.length})
                  </h4>
                  {upcomingTasks.length > 0 ? (
                    <div className="space-y-2">
                      {upcomingTasks.map((task, idx) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="p-3 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{task.sticker === 'rocket' ? '🚀' : task.sticker === 'star' ? '⭐' : '🎯'}</span>
                            <div>
                              <p className="font-semibold text-[#2c3e50]">{task.name}</p>
                              <p className="text-xs text-[#666]">🕐 {task.time} | ⭐ {5} points</p>
                            </div>
                          </div>
                          <AlertCircle className="w-5 h-5 text-orange-500" />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-green-600 font-semibold">✅ All tasks completed! Great job!</p>
                  )}
                </div>

                {/* Recently Completed Tasks */}
                <div>
                  <h4 className="text-lg font-bold text-[#2c3e50] mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Recently Completed ({recentCompletedTasks.length})
                  </h4>
                  {recentCompletedTasks.length > 0 ? (
                    <div className="space-y-2">
                      {recentCompletedTasks.map((task, idx) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="p-3 rounded-lg bg-green-50 border border-green-200 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{task.sticker === 'rocket' ? '🚀' : task.sticker === 'star' ? '⭐' : '✨'}</span>
                            <div>
                              <p className="font-semibold text-[#2c3e50] line-through opacity-60">{task.name}</p>
                              <p className="text-xs text-[#666]">✅ Completed at {task.completedAt}</p>
                            </div>
                          </div>
                          <Badge label="+5 pts" color="green" />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#666]">No completed tasks yet</p>
                  )}
                </div>
              </>
            )}
          </motion.div>

          {/* Children Overview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg border border-[#d8d3be]"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <Users className="w-5 sm:w-6 h-5 sm:h-6 text-[#7cc9f7]" />
              <h3 className="text-lg sm:text-2xl font-bold text-[#2c3e50]">Your Children</h3>
            </div>

            {combinedChildren.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {combinedChildren.map((child, idx) => {
                  const childTaskData = allChildTasks.find(ct => ct.childId === child.userId);
                  return (
                    <motion.div
                      key={child.userId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className={`p-3 sm:p-4 rounded-lg sm:rounded-xl cursor-pointer transition ${
                        selectedChild === child.userId
                          ? "bg-gradient-to-br from-[#f2a61c]/20 to-[#7cc9f7]/20 border-2 border-[#f2a61c]"
                          : "bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200"
                      }`}
                      onClick={() => setSelectedChild(child.userId)}
                    >
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div>
                          <p className="font-bold text-[#2c3e50] text-sm sm:text-base">{child.name}</p>
                          <p className="text-xs sm:text-sm text-[#666]">
                            {child.isFamilyChild ? `Age: ${child.age} years` : child.email}
                          </p>
                        </div>
                        <div className="text-2xl sm:text-3xl">{child.isFamilyChild ? "👧" : "👤"}</div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-semibold text-[#666]">Completion Rate</span>
                            <span className="text-xs font-bold text-[#f2a61c]">{childTaskData?.completionRate || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${childTaskData?.completionRate || 0}%` }}
                              transition={{ duration: 1 }}
                              className="bg-gradient-to-r from-[#9ce05f] to-[#7cc9f7] h-2 rounded-full"
                            />
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm text-[#666] flex justify-between">
                          <span>📝 <span className="font-bold text-green-600">{child.tasksCompleted} done</span></span>
                          <span>⭐ <span className="font-bold text-[#f2a61c]">{child.points} pts</span></span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#666] text-sm mb-3">No children added yet</p>
                <p className="text-xs text-[#999]">Add children in the Family Management section above</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Insights & Reports */}
        {selectedChildProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg border border-[#d8d3be]"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <TrendingUp className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" />
              <h3 className="text-lg sm:text-2xl font-bold text-[#2c3e50]">{selectedChildProfile.name}'s Activity Insights</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                <p className="text-xs font-bold text-[#666] mb-2">Last Updated</p>
                <p className="text-lg font-bold text-[#2c3e50]">{selectedChildProfile.lastUpdated}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                <p className="text-xs font-bold text-[#666] mb-2">Member Since</p>
                <p className="text-lg font-bold text-[#2c3e50]">{selectedChildProfile.createdAt}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

// Badge Component
const Badge = ({ label, color }) => {
  const bgColor = color === 'green' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800';
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${bgColor}`}>
      {label}
    </span>
  );
};

export default ParentDashboard;
