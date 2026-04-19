import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import Footer from "../components/Footer";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef9e7] to-[#ece7d4] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl"
      >
        {/* Logo */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-8"
        >
          <img src={Logo} alt="TinySteps" className="w-24 h-24 mx-auto" />
        </motion.div>

        {/* 404 Text */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-9xl font-black text-[#f2a61c]">404</h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-5xl font-bold text-[#2c3e50]">Oops! Page Not Found</h2>
          <p className="text-xl text-[#666] max-w-md mx-auto">
            It seems like this adventure path doesn't exist. But don't worry, there are many more exciting journeys waiting for you!
          </p>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="inline-block text-7xl mb-8 mt-8"
        >
          🔍
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-[#f2a61c] via-[#f5b428] to-[#d98d0f] text-white font-bold py-4 px-8 rounded-full shadow-lg text-lg"
          >
            🏠 Back to Home
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard")}
            className="border-2 border-[#7cc9f7] bg-white text-[#7cc9f7] font-bold py-4 px-8 rounded-full shadow-lg text-lg hover:bg-[#7cc9f7]/10 transition"
          >
            📚 Go to Dashboard
          </motion.button>
        </motion.div>

        {/* Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[#999] text-sm mt-8"
        >
          Need help? Contact us at support@tinysteps.com
        </motion.p>
      </motion.div>
      <Footer />
    </div>
  );
};

export default NotFound;
