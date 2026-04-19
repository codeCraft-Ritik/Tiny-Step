import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import authAPI from "../../services/authAPI";

function SettingsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [userId, setUserId] = useState(null);
  const [settings, setSettings] = useState({
    profilePicture: null,
    email: "",
    emailVerified: false,
    otpSent: false,
    otp: "",
    otpInput: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [sendingOTP, setSendingOTP] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);

  // Get user ID on mount
  useEffect(() => {
    try {
      const user = authAPI.getUser();
      if (user && user.id) {
        setUserId(user.id);
      }
    } catch (error) {
      console.error("Error getting user:", error);
    }
  }, []);

  // Load settings from database on mount
  useEffect(() => {
    if (userId && isOpen) {
      try {
        // Load email and emailVerified status from localStorage
        const userKey = `userProfile_${userId}`;
        const userProfile = localStorage.getItem(userKey);
        
        if (userProfile) {
          const profile = JSON.parse(userProfile);
          setSettings(prev => ({
            ...prev,
            email: profile.email || "",
            emailVerified: profile.emailVerified || false,
          }));
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
  }, [isOpen, userId]);

  // Save settings to database and localStorage
  const saveSettings = async (updatedSettings) => {
    if (!userId) return;
    
    try {
      // Also save to localStorage for offline support
      const userKey = `userProfile_${userId}`;
      const existingProfile = localStorage.getItem(userKey);
      const profile = existingProfile ? JSON.parse(existingProfile) : {};

      const updatedProfile = {
        ...profile,
        email: updatedSettings.email,
        emailVerified: updatedSettings.emailVerified,
        profilePicture: updatedSettings.profilePicture,
        lastUpdated: new Date().toLocaleString(),
      };

      localStorage.setItem(userKey, JSON.stringify(updatedProfile));
      setSettings(updatedSettings);
      setSuccessMessage("Settings saved successfully! ✓");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setErrors({ general: "Failed to save settings" });
    }
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const updatedSettings = { ...settings, profilePicture: event.target.result };
        saveSettings(updatedSettings);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendOTP = async () => {
    setErrors({});
    setSendingOTP(true);
    
    if (!settings.email) {
      setErrors({ email: "Please enter your email" });
      setSendingOTP(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(settings.email)) {
      setErrors({ email: "Please enter a valid email address" });
      setSendingOTP(false);
      return;
    }

    try {
      console.log("Sending OTP to:", settings.email);
      const response = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: settings.email }),
      });

      const data = await response.json();
      console.log("Backend response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      const updatedSettings = {
        ...settings,
        otpSent: true,
        otpInput: "", // Clear previous OTP input for new OTP
      };
      saveSettings(updatedSettings);
      setSuccessMessage(`✉️ OTP sent to ${settings.email}! Check your inbox.`);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setErrors({ email: error.message || "Failed to send OTP. Please check your internet connection." });
    } finally {
      setSendingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    setErrors({});
    if (!settings.otpInput) {
      setErrors({ otpInput: "Please enter OTP" });
      return;
    }

    if (settings.otpInput.length !== 6) {
      setErrors({ otpInput: "OTP must be 6 digits" });
      return;
    }

    setVerifyingOTP(true);

    try {
      console.log("Verifying OTP:", settings.otpInput);
      const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: settings.email,
          otp: settings.otpInput,
        }),
      });

      const data = await response.json();
      console.log("Backend response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify OTP");
      }

      const updatedSettings = {
        ...settings,
        emailVerified: true,
        otpSent: false,
        otpInput: "",
      };
      saveSettings(updatedSettings);
      setSuccessMessage("✅ You are verified for this Website");
      setTimeout(() => setSuccessMessage(""), 3000);
      
      // Redirect to verification success page
      setTimeout(() => {
        window.location.href = "/verification";
      }, 2000);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrors({ otpInput: error.message || "Invalid or expired OTP. Please try again." });
    } finally {
      setVerifyingOTP(false);
    }
  };

  const handleParentNameUpdate = (parent, name) => {
    const updatedSettings = { ...settings, [parent]: name };
    setSettings(updatedSettings);
  };


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
              <div className="sticky top-0 bg-gradient-to-r from-[#7b68ee] to-[#6a5acd] p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-white">Settings</h2>
                  <p className="text-sm font-semibold text-white/90 mt-1">
                    Manage your family profile and preferences
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

              {/* Tabs */}
              <div className="flex border-b border-[#e0e0e0] sticky top-20 bg-white">
                {[
                  { id: "profile", label: "👤 Profile" },
                  { id: "email", label: "✉️ Email" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-4 py-4 font-bold transition ${
                      activeTab === tab.id
                        ? "text-[#7b68ee] border-b-2 border-[#7b68ee]"
                        : "text-[#666] hover:text-[#333]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Success Message */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-6 mt-4 p-4 bg-green-50 border-2 border-green-300 rounded-xl text-green-700 font-semibold text-sm"
                >
                  {successMessage}
                </motion.div>
              )}

              {/* Tab Content */}
              <div className="p-6 space-y-6">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div>
                      <label className="block text-sm font-bold text-[#2c3e50] mb-4">
                        Profile Picture
                      </label>
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#7b68ee] to-[#6a5acd] flex items-center justify-center text-5xl overflow-hidden border-4 border-[#f5e499]">
                            {settings.profilePicture ? (
                              <img
                                src={settings.profilePicture}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              "👨‍👩‍👧"
                            )}
                          </div>
                          <label className="absolute bottom-0 right-0 bg-[#f5a623] rounded-full p-2 cursor-pointer hover:bg-[#e8942b] transition shadow-lg">
                            <Camera size={20} className="text-white" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleProfilePictureUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#2c3e50] mb-2">
                            Upload a family photo to personalize your profile
                          </p>
                          <p className="text-xs text-[#666]">
                            Recommended: 400x400px, max 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Tab */}
                {activeTab === "email" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-[#2c3e50] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) =>
                          setSettings({ ...settings, email: e.target.value })
                        }
                        placeholder="your@email.com"
                        disabled={settings.emailVerified}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                          errors.email
                            ? "border-red-500 focus:border-red-600"
                            : "border-[#f5e499] focus:border-[#f5a623]"
                        } ${
                          settings.emailVerified
                            ? "bg-[#f0f0f0]"
                            : "bg-[#fffacd]"
                        } disabled:opacity-60`}
                      />
                      {errors.email && (
                        <p className="text-red-600 text-xs font-semibold mt-1">
                          ❌ {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Send OTP Button - Always Visible */}
                    {!settings.emailVerified && !settings.otpSent && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSendOTP}
                        disabled={sendingOTP}
                        type="button"
                        className={`w-full px-6 py-3 rounded-full font-bold text-white flex items-center justify-center gap-2 transition ${
                          sendingOTP
                            ? "bg-gray-400 cursor-not-allowed opacity-70"
                            : "bg-gradient-to-r from-[#f5a623] to-[#f7b100] hover:shadow-lg cursor-pointer"
                        }`}
                      >
                        <Mail size={20} />
                        {sendingOTP ? "Sending OTP..." : "Send OTP"}
                      </motion.button>
                    )}

                    {/* OTP Sent Message & Resend Button */}
                    {settings.otpSent && !settings.emailVerified && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        <div className="p-3 bg-[#f0f8ff] border-2 border-[#85cbf2] rounded-lg">
                          <p className="text-sm text-[#0d7a9d] font-semibold">
                            📬 OTP sent to {settings.email}. Check your inbox!
                          </p>
                        </div>

                        {/* Resend OTP Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSendOTP}
                          disabled={sendingOTP}
                          type="button"
                          className="w-full px-4 py-2 text-sm font-bold text-[#0d7a9d] bg-[#dfefd0] border-2 border-[#85cbf2] rounded-lg hover:bg-[#c0e4b0] transition cursor-pointer"
                        >
                          {sendingOTP ? "Resending..." : "Didn't receive? Resend OTP"}
                        </motion.button>
                      </motion.div>
                    )}

                    {/* OTP Input - Shows when OTP Sent */}
                    {settings.otpSent && !settings.emailVerified && (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={settings.otpInput}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              otpInput: e.target.value,
                            })
                          }
                          placeholder="Enter 6-digit OTP"
                          maxLength="6"
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition text-center text-2xl tracking-widest font-bold ${
                            errors.otpInput
                              ? "border-red-500 focus:border-red-600"
                              : "border-[#f5e499] focus:border-[#f5a623]"
                          } bg-[#fffacd]`}
                        />
                        {errors.otpInput && (
                          <p className="text-red-600 text-xs font-semibold">
                            ❌ {errors.otpInput}
                          </p>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleVerifyOTP}
                          disabled={verifyingOTP}
                          className={`w-full px-6 py-3 rounded-full font-bold text-white transition ${
                            verifyingOTP
                              ? "bg-gray-400 cursor-not-allowed opacity-70"
                              : "bg-gradient-to-r from-[#6db938] to-[#3f8700] hover:shadow-lg"
                          }`}
                        >
                          {verifyingOTP ? "Verifying..." : "Verify OTP"}
                        </motion.button>
                      </div>
                    )}

                    {/* Success Message */}
                    {settings.emailVerified && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-green-50 border-2 border-green-300 rounded-xl"
                      >
                        <p className="flex items-center gap-2 text-green-700 font-bold">
                          <CheckCircle2 size={20} />
                          ✅ You are verified for this Website
                        </p>
                      </motion.div>
                    )}

                    <div className="bg-[#fff3cd] border-2 border-[#ffc107] rounded-xl p-4">
                      <p className="flex items-start gap-2 text-sm font-semibold text-[#856404]">
                        <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                        Email verification helps secure your account and receive important
                        notifications about your children's activities.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-[#e0e0e0] p-6 bg-[#f9f9f9]">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full px-6 py-3 rounded-full font-bold text-white bg-gradient-to-r from-[#7b68ee] to-[#6a5acd] hover:shadow-lg transition"
                >
                  Close Settings
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SettingsModal;
