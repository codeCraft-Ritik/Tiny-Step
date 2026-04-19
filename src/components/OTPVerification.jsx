import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import authAPI from "../services/authAPI";
import Logo from "../assets/Logo.png";
import Footer from "./Footer";

const OTPVerification = ({ email, onVerificationSuccess }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [showResendButton, setShowResendButton] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);

  // Auto-focus and format OTP input
  const handleOtpChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Only digits
    if (value.length > 6) {
      value = value.slice(0, 6);
    }
    setOtp(value);

    // Clear errors when user starts typing
    if (errors) {
      setErrors("");
    }
  };

  // Handle OTP submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    setSuccessMessage("");

    // Validate OTP
    if (!otp || otp.length !== 6) {
      setErrors("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.verifyOTP(email, otp);

      setSuccessMessage("✅ Email verified! Logging you in...");
      console.log("OTP verified successfully:", response);

      // Trigger callback if provided
      if (onVerificationSuccess) {
        onVerificationSuccess(response.data);
      }

      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("OTP verification error:", err);
      const errorMessage =
        err.message || "OTP verification failed. Please try again.";

      // Check if max attempts exceeded
      if (errorMessage.includes("attempts exceeded")) {
        setErrors(errorMessage);
        setOtpAttempts(5);
        setOtp("");
      } else if (errorMessage.includes("attempts remaining")) {
        // Extract remaining attempts from message
        const match = errorMessage.match(/(\d+) attempts/);
        const attempts = match ? parseInt(match[1]) : 0;
        setOtpAttempts(5 - attempts);
        setErrors(errorMessage);
        setOtp("");
      } else {
        setErrors(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOTP = async () => {
    setErrors("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      await authAPI.resendOTP(email);
      setSuccessMessage(
        "✅ New OTP sent to your email! Check your inbox."
      );
      setOtp("");
      setOtpAttempts(0);

      // Start timer for resend button
      setShowResendButton(false);
      setResendTimer(60);

      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setShowResendButton(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Resend OTP error:", err);
      setErrors(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fef9e7] to-[#ece7d4]">
      <div className="flex-1 w-full p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 sm:gap-4 mb-8 sm:mb-12"
          >
            <img
              src={Logo}
              alt="TinySteps"
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg"
            />
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2c3e50]">
              TinySteps
            </h1>
          </motion.div>

          {/* Main Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-center"
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
                  {/* Email Verification SVG */}
                  <svg viewBox="0 0 300 300" className="w-full h-auto">
                    {/* Background */}
                    <defs>
                      <linearGradient
                        id="bgGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#e8f4f8" />
                        <stop offset="100%" stopColor="#d0e8f2" />
                      </linearGradient>
                    </defs>

                    <rect
                      width="300"
                      height="300"
                      fill="url(#bgGradient)"
                      rx="10"
                    />

                    {/* Envelope */}
                    <rect
                      x="50"
                      y="100"
                      width="200"
                      height="140"
                      fill="white"
                      stroke="#0d7a9d"
                      strokeWidth="3"
                      rx="5"
                    />

                    {/* Envelope Flap */}
                    <polygon
                      points="50,100 150,160 250,100"
                      fill="#0d7a9d"
                      opacity="0.2"
                    />

                    {/* Letter Inside */}
                    <rect
                      x="70"
                      y="130"
                      width="160"
                      height="100"
                      fill="#87ceeb"
                      rx="3"
                    />

                    {/* OTP Numbers on Letter */}
                    <text
                      x="150"
                      y="175"
                      fontSize="36"
                      fontWeight="bold"
                      fill="#0d7a9d"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      • • • • • •
                    </text>

                    {/* Checkmark */}
                    <circle
                      cx="240"
                      cy="60"
                      r="25"
                      fill="#6db938"
                      opacity="0.9"
                    />
                    <path
                      d="M 235 60 L 240 65 L 248 55"
                      stroke="white"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
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
                Verify Your Email
              </h2>
              <p className="text-[#666] text-center text-sm sm:text-base lg:text-lg max-w-sm">
                We sent a 6-digit OTP to {email}. Please enter it below to
                verify your account.
              </p>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-xl border-2 border-[#f2a61c]/20"
            >
              {/* Progress Bar */}
              <div className="mb-6 sm:mb-8">
                <div className="flex justify-between items-center mb-2 sm:mb-3">
                  <span className="text-xs sm:text-sm font-bold text-[#2c3e50]">
                    Email Verification
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-[#999]">
                    Final Step
                  </span>
                </div>
                <div className="w-full bg-[#e8e8e8] rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "80%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-2 bg-[#0d7a9d] rounded-full"
                  />
                </div>
              </div>

              {/* Success Message */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 sm:p-4 bg-green-50 border-2 border-green-300 rounded-lg text-green-700 font-semibold text-xs sm:text-sm mb-4 sm:mb-6"
                >
                  {successMessage}
                </motion.div>
              )}

              {/* Error Message */}
              {errors && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 sm:p-4 bg-red-50 border-2 border-red-300 rounded-lg text-red-700 font-semibold text-xs sm:text-sm mb-4 sm:mb-6"
                >
                  ❌ {errors}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* OTP Input */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm sm:text-base font-bold text-[#2c3e50] mb-3 sm:mb-4">
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={handleOtpChange}
                    disabled={isLoading || otpAttempts >= 5}
                    maxLength="6"
                    placeholder="000000"
                    className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#f0f8ff] border-2 rounded-lg focus:outline-none transition-colors text-center text-3xl sm:text-4xl font-bold tracking-widest text-[#0d7a9d] disabled:opacity-50 ${
                      errors
                        ? "border-red-500 focus:border-red-600"
                        : "border-[#0d7a9d] focus:border-[#0d5a7a]"
                    }`}
                  />
                  <p className="text-xs sm:text-sm text-[#666] mt-2 text-center">
                    {otp.length}/6 digits entered
                  </p>
                </motion.div>

                {/* Attempt Counter */}
                {otpAttempts > 0 && otpAttempts < 5 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-2 sm:p-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg text-yellow-700 font-semibold text-xs sm:text-sm text-center"
                  >
                    ⚠️ {5 - otpAttempts} attempt{5 - otpAttempts !== 1 ? "s" : ""} remaining
                  </motion.div>
                )}

                {/* Verify Button */}
                <motion.button
                  whileHover={!isLoading && otpAttempts < 5 ? { scale: 1.02 } : {}}
                  whileTap={
                    !isLoading && otpAttempts < 5 ? { scale: 0.98 } : {}
                  }
                  type="submit"
                  disabled={isLoading || otp.length !== 6 || otpAttempts >= 5}
                  className="w-full bg-gradient-to-r from-[#0d7a9d] to-[#0d5a7a] text-white font-bold py-3 sm:py-4 rounded-full hover:shadow-lg transition-all disabled:opacity-50 text-sm sm:text-base lg:text-lg flex items-center justify-center gap-2 sm:gap-3"
                >
                  {isLoading ? "Verifying..." : "Verify OTP ✓"}
                </motion.button>

                {/* Resend OTP Section */}
                <div className="pt-2 sm:pt-4 border-t-2 border-[#f5e499]">
                  <p className="text-xs sm:text-sm text-[#666] text-center mb-3 sm:mb-4">
                    Didn't receive the OTP?
                  </p>

                  {showResendButton ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#f5a623] to-[#e8942b] text-white font-bold py-2 sm:py-3 rounded-full hover:shadow-lg transition-all disabled:opacity-50 text-xs sm:text-sm lg:text-base"
                    >
                      Resend OTP 📧
                    </motion.button>
                  ) : (
                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-[#999]">
                        You can resend OTP in{" "}
                        <span className="font-bold text-[#f5a623]">
                          {resendTimer}s
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Back to Login Link */}
                <p className="text-center text-xs sm:text-sm text-[#666] mt-4 sm:mt-6">
                  Already verified?{" "}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => navigate("/login")}
                    disabled={isLoading}
                    className="text-[#0d5a7a] font-semibold hover:underline transition disabled:opacity-50"
                  >
                    Go to Login
                  </motion.button>
                </p>
              </form>

              {/* Security Note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50 border-l-4 border-[#0d7a9d] rounded text-xs sm:text-sm text-[#0d5a7a]"
              >
                <p className="font-semibold mb-1">🔒 Security Note:</p>
                <p>
                  Never share your OTP with anyone. TinySteps staff will never
                  ask for your OTP.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OTPVerification;
