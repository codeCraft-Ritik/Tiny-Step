import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Logo from "../../assets/Logo.png";
import { validateSignupForm, validatePassword } from "../../utils/validation";
import Footer from "../../components/Footer";
import OTPVerification from "../../components/OTPVerification";
import authAPI from "../../services/authAPI";
import { initializeUserProfileWithFamily } from "../../utils/familyInitialization";

const Signup = () => {
  const navigate = useNavigate();
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [parentFirstName, setParentFirstName] = useState("");
  const [parentLastName, setParentLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    strength: "weak",
    message: "",
  });
  const [userRole, setUserRole] = useState(""); // "parent" or "child"

  const handlePasswordChange = (value) => {
    setPassword(value);
    const validation = validatePassword(value);
    setPasswordStrength({
      strength: validation.strength,
      message: validation.message,
    });
    // Clear password error when user starts fixing
    if (errors.password) {
      setErrors({ ...errors, password: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrors({});

    // Validate role is selected
    if (!userRole) {
      setErrors({ userRole: "Please select whether you are a Parent or Child" });
      return;
    }

    // Validate names are not empty
    if (!parentFirstName.trim() || !parentLastName.trim()) {
      setErrors({ parentName: "Please enter both first and last name" });
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    // Validate agreements
    if (!termsAgreed) {
      setErrors({ termsAgreed: "You must agree to Terms of Service" });
      return;
    }

    if (!privacyAgreed) {
      setErrors({ privacyAgreed: "You must agree to Privacy Policy" });
      return;
    }

    // Validate form (using full name for validation)
    const validation = validateSignupForm(parentFirstName, email, password);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    try {
      // Call the backend API
      const response = await authAPI.signup({
        firstName: parentFirstName.trim(),
        lastName: parentLastName.trim(),
        email,
        password,
        confirmPassword,
        role: userRole,
        termsAgreed,
        privacyAgreed,
      });
      
      console.log("Signup successful:", response);
      
      // Store email for OTP verification
      setUserEmail(email);
      setSuccessMessage("🎉 Account created! Check your email for the OTP.");
      
      // Show OTP verification form
      setTimeout(() => {
        setShowOTPVerification(true);
      }, 1500);
    } catch (err) {
      console.error("Signup error:", err);
      const errorMessage = err.message || "Signup failed. Please try again.";
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerificationSuccess = async (verificationData) => {
    console.log("OTP verified successfully:", verificationData);
    
    // Initialize family profile for new user
    try {
      initializeUserProfileWithFamily();
    } catch (err) {
      console.error("Error initializing family:", err);
    }
  };

  return (
    <>
      {showOTPVerification ? (
        <OTPVerification 
          email={userEmail} 
          onVerificationSuccess={handleOTPVerificationSuccess}
        />
      ) : (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fef9e7] to-[#ece7d4]">
      <div className="flex-1 w-full p-4 sm:p-6 md:p-8">
        {/* Logo */}
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 sm:gap-4 mb-8 sm:mb-12"
          >
            <img src={Logo} alt="TinySteps" className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg" />
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2c3e50]">TinySteps</h1>
          </motion.div>

          {/* Main Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-start"
          >
          {/* Left Side - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center justify-center"
          >
            {/* Illustration Container */}
            <div className="relative w-full max-w-xs sm:max-w-sm mb-6 sm:mb-8">
              {/* Yellow Border Frame */}
              <div className="border-4 sm:border-8 border-[#f5e499] rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-white shadow-lg relative">
                {/* Cottage Scene SVG */}
                <svg viewBox="0 0 300 300" className="w-full h-auto">
                  {/* Sky with moon */}
                  <defs>
                    <radialGradient id="moonGradient" cx="30%" cy="30%">
                      <stop offset="0%" stopColor="#e8f4f8" />
                      <stop offset="100%" stopColor="#a8d5e8" />
                    </radialGradient>
                  </defs>

                  {/* Background sky */}
                  <circle cx="150" cy="100" r="80" fill="url(#moonGradient)" />

                  {/* Trees */}
                  <ellipse cx="60" cy="140" rx="30" ry="50" fill="#7cb342" />
                  <ellipse cx="240" cy="150" rx="35" ry="55" fill="#7cb342" />
                  <rect x="55" y="180" width="10" height="40" fill="#8b6534" />
                  <rect x="235" y="190" width="10" height="30" fill="#8b6534" />

                  {/* Cottage House */}
                  <rect x="80" y="130" width="140" height="100" fill="#8b6f47" />

                  {/* Roof */}
                  <polygon points="80,130 150,60 220,130" fill="#d2691e" />

                  {/* Door */}
                  <rect x="135" y="180" width="30" height="50" fill="#6b4423" />
                  <circle cx="160" cy="205" r="3" fill="#ffd700" />

                  {/* Windows */}
                  <rect x="100" y="155" width="20" height="20" fill="#87ceeb" />
                  <rect x="180" y="155" width="20" height="20" fill="#87ceeb" />

                  {/* Path */}
                  <path d="M 150 230 Q 140 250, 140 270" stroke="#d2b48c" strokeWidth="8" fill="none" />
                </svg>
              </div>

              {/* Green Floating Button */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-12 h-12 sm:w-16 sm:h-16 bg-[#9ce05f] rounded-full shadow-lg flex items-center justify-center text-xl sm:text-2xl"
              >
                ✨
              </motion.div>
            </div>

            {/* Left Side Text */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2c3e50] text-center mb-3 sm:mb-4">
              Join the Adventure
            </h2>
            <p className="text-[#666] text-center text-sm sm:text-base lg:text-lg max-w-sm">
              Create a magical space for your child's growth and milestones.
            </p>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-xl border-2 border-[#f2a61c]/20"
          >
            {/* Progress Indicator */}
            <div className="mb-6 sm:mb-8">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <span className="text-xs sm:text-sm font-bold text-[#2c3e50]">Adventure Start</span>
                <span className="text-xs sm:text-sm font-semibold text-[#999]">Almost There</span>
              </div>
              <div className="w-full bg-[#e8e8e8] rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "40%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-2 bg-[#6db938] rounded-full"
                />
              </div>
            </div>

            {/* Google Sign Up Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => console.log("Google signup clicked")}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#FF6B6B] via-[#FF8E72] to-[#FFA500] text-white font-bold py-3 sm:py-4 rounded-full hover:shadow-lg transition-all text-sm sm:text-base lg:text-lg flex items-center justify-center gap-2 sm:gap-3 border-2 border-[#FF6B6B]/40 disabled:opacity-50"
            >
              <span className="text-xl sm:text-2xl">🔐</span>
              <span>Sign Up with Google</span>
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3 sm:gap-4 my-4 sm:my-6">
              <div className="flex-1 h-0.5 bg-gradient-to-r from-[#f5e499] to-transparent" />
              <span className="text-xs sm:text-sm font-semibold text-[#999]">Or</span>
              <div className="flex-1 h-0.5 bg-gradient-to-l from-[#f5e499] to-transparent" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 sm:p-4 bg-green-50 border-2 border-green-300 rounded-lg text-green-700 font-semibold text-xs sm:text-sm"
                >
                  ✅ {successMessage}
                </motion.div>
              )}

              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 sm:p-4 bg-red-50 border-2 border-red-300 rounded-lg text-red-700 font-semibold text-xs sm:text-sm"
                >
                  ❌ {errors.submit}
                </motion.div>
              )}

              {/* USER ROLE SELECTOR */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <label className="block text-sm sm:text-base font-bold text-[#2c3e50] mb-3 sm:mb-4">
                  Are you a Parent or Child?
                </label>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* Parent Option */}
                  <motion.button
                    type="button"
                    onClick={() => setUserRole("parent")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl font-bold text-sm sm:text-base transition-all border-3 ${
                      userRole === "parent"
                        ? "border-[#6db938] bg-[#f0f8e8] text-[#2e4d00] shadow-lg"
                        : "border-[#ddd] bg-white text-[#666] hover:border-[#6db938]/50"
                    }`}
                  >
                    <div className="text-3xl sm:text-4xl mb-2">👨‍👩‍👧</div>
                    <div>Parent</div>
                  </motion.button>

                  {/* Child Option */}
                  <motion.button
                    type="button"
                    onClick={() => setUserRole("child")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl font-bold text-sm sm:text-base transition-all border-3 ${
                      userRole === "child"
                        ? "border-[#0d7a9d] bg-[#d8f4fc] text-[#0d5a7a] shadow-lg"
                        : "border-[#ddd] bg-white text-[#666] hover:border-[#0d7a9d]/50"
                    }`}
                  >
                    <div className="text-3xl sm:text-4xl mb-2">👧</div>
                    <div>Child</div>
                  </motion.button>
                </div>
                {errors.userRole && (
                  <motion.p className="text-red-600 text-xs sm:text-sm font-semibold mt-2">
                    ❌ {errors.userRole}
                  </motion.p>
                )}
              </motion.div>

              {/* Parent Info Row - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Parent First Name */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-xs sm:text-sm font-bold text-[#2c3e50] mb-1.5 sm:mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={parentFirstName}
                    onChange={(e) => {
                      setParentFirstName(e.target.value);
                      if (errors.parentName) {
                        setErrors({ ...errors, parentName: "" });
                      }
                    }}
                    required
                    disabled={isLoading}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[#ffffe0] border-2 rounded-lg focus:outline-none transition-colors text-sm text-[#2c3e50] disabled:opacity-50 ${
                      errors.parentName
                        ? "border-red-500 focus:border-red-600"
                        : "border-[#f5e499] focus:border-[#f5a623]"
                    }`}
                    placeholder="First name"
                  />
                  {errors.parentName && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-600 text-xs font-semibold mt-0.5 sm:mt-1"
                    >
                      ❌ {errors.parentName}
                    </motion.p>
                  )}
                </motion.div>

                {/* Parent Last Name */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42 }}
                >
                  <label className="block text-xs sm:text-sm font-bold text-[#2c3e50] mb-1.5 sm:mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={parentLastName}
                    onChange={(e) => {
                      setParentLastName(e.target.value);
                      if (errors.parentName) {
                        setErrors({ ...errors, parentName: "" });
                      }
                    }}
                    required
                    disabled={isLoading}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[#ffffe0] border-2 rounded-lg focus:outline-none transition-colors text-sm text-[#2c3e50] disabled:opacity-50 ${
                      errors.parentName
                        ? "border-red-500 focus:border-red-600"
                        : "border-[#f5e499] focus:border-[#f5a623]"
                    }`}
                    placeholder="Last name"
                  />
                </motion.div>

                {/* Email Address */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-xs sm:text-sm font-bold text-[#2c3e50] mb-1.5 sm:mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors({ ...errors, email: "" });
                      }
                    }}
                    required
                    disabled={isLoading}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[#ffffe0] border-2 rounded-lg focus:outline-none transition-colors text-sm text-[#2c3e50] disabled:opacity-50 ${
                      errors.email
                        ? "border-red-500 focus:border-red-600"
                        : "border-[#f5e499] focus:border-[#f5a623]"
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-600 text-xs font-semibold mt-0.5 sm:mt-1"
                    >
                      ❌ {errors.email}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <label className="block text-xs sm:text-sm font-bold text-[#2c3e50] mb-1.5 sm:mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    required
                    disabled={isLoading}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[#ffffe0] border-2 rounded-lg focus:outline-none transition-colors text-sm text-[#2c3e50] pr-10 disabled:opacity-50 ${
                      errors.password
                        ? "border-red-500 focus:border-red-600"
                        : "border-[#f5e499] focus:border-[#f5a623]"
                    }`}
                    placeholder="Create password"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-2.5 sm:top-3 text-[#f5a623] hover:text-[#e8942b] disabled:opacity-50 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 sm:w-5 h-4 sm:h-5" />
                    ) : (
                      <Eye className="w-4 sm:w-5 h-4 sm:h-5" />
                    )}
                  </motion.button>
                </div>
                {password && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1.5 sm:mt-2 flex items-center gap-2 text-xs"
                  >
                    <div className={`flex-1 h-1 rounded-full ${
                      passwordStrength.strength === "strong" ? "bg-green-500" :
                      passwordStrength.strength === "medium" ? "bg-yellow-500" :
                      "bg-red-500"
                    }`} />
                    <span className={`text-xs ${
                      passwordStrength.strength === "strong" ? "text-green-600" :
                      passwordStrength.strength === "medium" ? "text-yellow-600" :
                      "text-red-600"
                    }`}>
                      {passwordStrength.message}
                    </span>
                  </motion.div>
                )}
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-600 text-xs font-semibold mt-0.5 sm:mt-1"
                  >
                    ❌ {errors.password}
                  </motion.p>
                )}
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.57 }}
              >
                <label className="block text-xs sm:text-sm font-bold text-[#2c3e50] mb-1.5 sm:mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                    }}
                    required
                    disabled={isLoading}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[#ffffe0] border-2 rounded-lg focus:outline-none transition-colors text-sm text-[#2c3e50] pr-10 disabled:opacity-50 ${
                      errors.confirmPassword
                        ? "border-red-500 focus:border-red-600"
                        : "border-[#f5e499] focus:border-[#f5a623]"
                    }`}
                    placeholder="Re-enter password"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-2.5 sm:top-3 text-[#f5a623] hover:text-[#e8942b] disabled:opacity-50 transition"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 sm:w-5 h-4 sm:h-5" />
                    ) : (
                      <Eye className="w-4 sm:w-5 h-4 sm:h-5" />
                    )}
                  </motion.button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-600 text-xs font-semibold mt-0.5 sm:mt-1"
                  >
                    ❌ Passwords do not match
                  </motion.p>
                )}
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-600 text-xs font-semibold mt-0.5 sm:mt-1"
                  >
                    ❌ {errors.confirmPassword}
                  </motion.p>
                )}
              </motion.div>

              {/* Terms & Privacy Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="space-y-3"
              >
                {/* Terms Checkbox */}
                <label className="flex items-start gap-2 sm:gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => {
                      setTermsAgreed(e.target.checked);
                      if (errors.termsAgreed) setErrors({ ...errors, termsAgreed: "" });
                    }}
                    disabled={isLoading}
                    className="mt-0.5 w-4 h-4 sm:w-5 sm:h-5 cursor-pointer accent-[#6db938] disabled:opacity-50"
                  />
                  <span className="text-xs sm:text-sm text-[#2c3e50]">
                    I agree to the{" "}
                    <motion.a
                      whileHover={{ textDecoration: "underline" }}
                      href="/terms-of-service"
                      className="text-[#f5a623] font-semibold hover:text-[#e8942b]"
                    >
                      Terms of Service
                    </motion.a>
                  </span>
                </label>
                {errors.termsAgreed && (
                  <motion.p className="text-red-600 text-xs font-semibold">
                    ❌ {errors.termsAgreed}
                  </motion.p>
                )}

                {/* Privacy Checkbox */}
                <label className="flex items-start gap-2 sm:gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={privacyAgreed}
                    onChange={(e) => {
                      setPrivacyAgreed(e.target.checked);
                      if (errors.privacyAgreed) setErrors({ ...errors, privacyAgreed: "" });
                    }}
                    disabled={isLoading}
                    className="mt-0.5 w-4 h-4 sm:w-5 sm:h-5 cursor-pointer accent-[#6db938] disabled:opacity-50"
                  />
                  <span className="text-xs sm:text-sm text-[#2c3e50]">
                    I agree to the{" "}
                    <motion.a
                      whileHover={{ textDecoration: "underline" }}
                      href="/privacy-policy"
                      className="text-[#f5a623] font-semibold hover:text-[#e8942b]"
                    >
                      Privacy Policy
                    </motion.a>
                  </span>
                </label>
                {errors.privacyAgreed && (
                  <motion.p className="text-red-600 text-xs font-semibold">
                    ❌ {errors.privacyAgreed}
                  </motion.p>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.button
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#9ce05f] to-[#6db938] text-white font-bold py-3 sm:py-4 rounded-full hover:shadow-lg transition-all disabled:opacity-50 text-sm sm:text-base lg:text-lg flex items-center justify-center gap-2 sm:gap-3"
              >
                {isLoading ? "Creating..." : "Begin the Journey 🚀"}
              </motion.button>

              {/* Login Link */}
              <p className="text-center text-xs sm:text-sm text-[#666]">
                Have an account?{" "}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => navigate("/login")}
                  disabled={isLoading}
                  className="text-[#0d5a7a] font-semibold hover:underline transition disabled:opacity-50"
                >
                  Sign in
                </motion.button>
              </p>
            </form>
          </motion.div>
        </motion.div>
        </div>
      </div>
      <Footer />
    </div>
      )}
    </>
  );
};

export default Signup;
