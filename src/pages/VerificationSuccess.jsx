import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import Footer from "../components/Footer";

const VerificationSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef9e7] to-[#ece7d4] flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl"
        >
        {/* Success Icon */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#9ce05f] to-[#6db938] rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-7xl">✨</span>
          </div>
        </motion.div>

        {/* Logo */}
        <motion.div className="mb-6">
          <img src={Logo} alt="TinySteps" className="w-20 h-20 mx-auto" />
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-8"
        >
          <h1 className="text-5xl font-bold text-[#2c3e50]">
            Welcome to TinySteps! 🎉
          </h1>
          <p className="text-xl text-[#666] max-w-md mx-auto">
            Your account has been created successfully. Get ready for an amazing learning adventure!
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8 text-left space-y-4"
        >
          <h3 className="text-2xl font-bold text-[#2c3e50] mb-6">What's Next?</h3>
          <div className="space-y-3">
            {[
              { icon: "📧", title: "Check Your Email", desc: "Verify your email to unlock all features" },
              { icon: "👨‍👧", title: "Complete Your Profile", desc: "Add more explorers and customize preferences" },
              { icon: "🎓", title: "Start Learning", desc: "Begin adventures tailored to your child's age" },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="flex items-start gap-4 p-4 bg-[#fef9e7] rounded-lg"
              >
                <span className="text-3xl">{step.icon}</span>
                <div>
                  <p className="font-bold text-[#2c3e50]">{step.title}</p>
                  <p className="text-sm text-[#666]">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-[#9ce05f] to-[#6db938] text-white font-bold py-4 px-8 rounded-full shadow-lg text-lg"
          >
            🚀 Go to Dashboard
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="border-2 border-[#f2a61c] bg-white text-[#f2a61c] font-bold py-4 px-8 rounded-full shadow-lg text-lg hover:bg-[#f2a61c]/10 transition"
          >
            📚 Learn More
          </motion.button>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 p-4 bg-blue-50 border border-[#7cc9f7] rounded-xl"
        >
          <p className="text-[#0d5a7a] font-semibold">
            💡 A verification email has been sent to your inbox. Please verify your email to ensure account security.
          </p>
        </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default VerificationSuccess;
