import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";

const ActivityCategories = [
  { id: "play", label: "Play & Learn", emoji: "🎮", color: "#85cbf2" },
  { id: "activity", label: "Activity", emoji: "🏃", color: "#b5ec66" },
  { id: "meal", label: "Meal Time", emoji: "🍽️", color: "#f5b301" },
  { id: "learning", label: "Learning", emoji: "📚", color: "#d4a5ff" },
  { id: "creative", label: "Creative", emoji: "🎨", color: "#ff9999" },
  { id: "exercise", label: "Exercise", emoji: "⚽", color: "#99ddff" },
  { id: "sleep", label: "Sleep Time", emoji: "😴", color: "#ffe6cc" },
  { id: "other", label: "Other", emoji: "⭐", color: "#f0f0f0" },
];

function AddActivityModal({ isOpen, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("activity");
  const [selectedChild, setSelectedChild] = useState("");
  const [children, setChildren] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errors, setErrors] = useState({});

  // Load children from parent profile
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log("🔍 Loading children for modal - User:", user.id);
      
      if (user && user.id) {
        const userProfileKey = `userProfile_${user.id}`;
        const userProfile = localStorage.getItem(userProfileKey);
        console.log("📂 Looking for profile at:", userProfileKey);
        
        if (userProfile) {
          const profile = JSON.parse(userProfile);
          // Load children from the profile
          const profileChildren = profile.children || [];
          console.log("👧👦 Children found in profile:", profileChildren);
          
          setChildren(profileChildren);
          
          // Set first child as default
          if (profileChildren.length > 0 && !selectedChild) {
            setSelectedChild(profileChildren[0].id.toString());
            console.log("✅ Set default child:", profileChildren[0].name);
          } else if (profileChildren.length === 0) {
            console.warn("⚠️  No children found in profile!");
          }
        } else {
          console.warn("⚠️  No user profile found at", userProfileKey);
        }
      }
    } catch (error) {
      console.error("❌ Error loading children for modal:", error);
      setChildren([]);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Activity title is required";
    if (!selectedCategory) newErrors.category = "Please select a category";
    
    // CRITICAL: Check if children are configured
    if (children.length === 0) {
      newErrors.child = "❌ No children found! Please go to Parent Dashboard and add children in Family Management first.";
      console.error("❌ BLOCKING TASK CREATION: No children configured!");
      setErrors(newErrors);
      return;
    }
    
    if (!selectedChild) {
      newErrors.child = "Please select which child this activity is for";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Find selected child name
    const selectedChildObj = children.find((c) => c.id.toString() === selectedChild);
    const childName = selectedChildObj?.name || null;
    
    // CRITICAL: Ensure we have a valid child name
    if (!childName || childName === "Child") {
      console.error("❌ INVALID CHILD:", { selectedChild, selectedChildObj, childName });
      setErrors({ child: "Invalid child selection. Please select a valid child." });
      return;
    }
    
    console.log("🎯 Creating activity for child:");
    console.log("   Selected child ID:", selectedChild);
    console.log("   Selected child object:", selectedChildObj);
    console.log("   Derived child name:", childName);
    console.log("   ✅ VALID: Will save to childTasks_" + childName);

    // Create activity object
    const newActivity = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      category: selectedCategory,
      childId: selectedChild,
      childName: childName,  // CRITICAL: Must have childName
      startTime,
      endTime,
      completed: false,
      createdAt: new Date().toLocaleString(),
    };
    
    console.log("📦 New activity object:", newActivity);
    console.log("✅ Task will be saved with key: childTasks_" + newActivity.childName);

    onAdd(newActivity);

    // Reset form
    setTitle("");
    setDescription("");
    setSelectedCategory("activity");
    setSelectedChild(children.length > 0 ? children[0].id.toString() : "");
    setStartTime("");
    setEndTime("");
    setErrors({});
    onClose();
  };

  const selectedCategoryObj = ActivityCategories.find(
    (cat) => cat.id === selectedCategory
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl bg-white rounded-[30px] shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#f5b301] to-[#f7b100] p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-white">Add New Activity</h2>
                  <p className="text-sm font-semibold text-white/90 mt-1">
                    Plan what your little one will do today
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white hover:bg-white/30"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* NO CHILDREN WARNING */}
                {children.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border-2 border-red-300 rounded-xl"
                  >
                    <p className="text-red-700 font-bold text-sm mb-2">
                      ❌ No Children Configured!
                    </p>
                    <p className="text-red-600 text-xs mb-3">
                      Before you can add activities, you need to add children to your family.
                    </p>
                    <p className="text-red-600 text-xs font-semibold">
                      👉 Go to <strong>Parent Dashboard → Family Management</strong> and add your children first. Then come back here!
                    </p>
                  </motion.div>
                )}

                {/* Activity Title */}
                <div>
                  <label className="block text-sm font-bold text-[#2c3e50] mb-2">
                    What's the Activity? *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errors.title) setErrors({ ...errors, title: "" });
                    }}
                    placeholder="e.g., Draw a picture, Read a story, Play hide and seek"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                      errors.title
                        ? "border-red-500 focus:border-red-600"
                        : "border-[#f5e499] focus:border-[#f5a623]"
                    } bg-[#fffacd]`}
                  />
                  {errors.title && (
                    <p className="text-red-600 text-xs font-semibold mt-1">
                      ❌ {errors.title}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-[#2c3e50] mb-2">
                    Details (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add any notes, tips, or objectives for this activity..."
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-[#f5e499] rounded-xl focus:outline-none focus:border-[#f5a623] transition bg-[#fffacd]"
                  />
                </div>

                {/* Child Selector - Show if multiple children */}
                {children.length > 0 && (
                  <div>
                    <label className="block text-sm font-bold text-[#2c3e50] mb-2">
                      Which child is this for? *
                    </label>
                    <select
                      value={selectedChild}
                      onChange={(e) => {
                        setSelectedChild(e.target.value);
                        if (errors.child) setErrors({ ...errors, child: "" });
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                        errors.child
                          ? "border-red-500 focus:border-red-600"
                          : "border-[#f5e499] focus:border-[#f5a623]"
                      } bg-[#fffacd] cursor-pointer`}
                    >
                      <option value="">Select a child...</option>
                      {children.map((child) => (
                        <option key={child.id} value={child.id.toString()}>
                          {child.name} (Age {child.age})
                        </option>
                      ))}
                    </select>
                    {errors.child && (
                      <p className="text-red-600 text-xs font-semibold mt-1">
                        ❌ {errors.child}
                      </p>
                    )}
                  </div>
                )}

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-bold text-[#2c3e50] mb-3">
                    Category *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ActivityCategories.map((category) => (
                      <motion.button
                        key={category.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setSelectedCategory(category.id)}
                        className={`p-3 rounded-xl font-bold transition border-2 ${
                          selectedCategory === category.id
                            ? "border-[#333] shadow-lg"
                            : "border-transparent hover:border-[#ddd]"
                        }`}
                        style={{
                          backgroundColor:
                            selectedCategory === category.id
                              ? category.color
                              : category.color + "40",
                        }}
                      >
                        <div className="text-2xl mb-1">{category.emoji}</div>
                        <div className="text-xs leading-tight">{category.label}</div>
                      </motion.button>
                    ))}
                  </div>
                  {errors.category && (
                    <p className="text-red-600 text-xs font-semibold mt-1">
                      ❌ {errors.category}
                    </p>
                  )}
                </div>

                {/* Time Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#2c3e50] mb-2">
                      Start Time (Optional)
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#f5e499] rounded-xl focus:outline-none focus:border-[#f5a623] transition bg-[#fffacd]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#2c3e50] mb-2">
                      End Time (Optional)
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#f5e499] rounded-xl focus:outline-none focus:border-[#f5a623] transition bg-[#fffacd]"
                    />
                  </div>
                </div>

                {/* Preview */}
                {title && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-[#f0f8ff] border-2 border-[#85cbf2]"
                  >
                    <p className="text-xs font-bold text-[#0d7a9d] mb-2">PREVIEW:</p>
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{selectedCategoryObj?.emoji}</div>
                      <div className="flex-1">
                        <p className="font-bold text-[#2c3e50]">{title}</p>
                        {description && (
                          <p className="text-sm text-[#666] mt-1">{description}</p>
                        )}
                        {startTime && (
                          <p className="text-xs text-[#999] mt-1">
                            ⏰ {startTime} {endTime ? `- ${endTime}` : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 rounded-full font-bold text-[#2c3e50] bg-[#e0e0e0] hover:bg-[#d0d0d0] transition"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={children.length === 0}
                    className={`flex-1 px-6 py-3 rounded-full font-bold text-white flex items-center justify-center gap-2 transition ${
                      children.length === 0
                        ? "bg-gray-400 cursor-not-allowed opacity-50"
                        : "bg-gradient-to-r from-[#f5a623] to-[#f7b100] hover:shadow-lg"
                    }`}
                  >
                    <Plus size={20} />
                    {children.length === 0 ? "❌ Add Children First" : "✅ Add Activity"}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AddActivityModal;
