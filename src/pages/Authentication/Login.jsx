import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Logo from "../../assets/Logo.png";
import { validateLoginForm } from "../../utils/validation";
import Footer from "../../components/Footer";
import authAPI from "../../services/authAPI";
import { initializeUserProfileWithFamily } from "../../utils/familyInitialization";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Login = () => {
  const navigate = useNavigate();
  const [loginMode, setLoginMode] = useState("parent");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [childParentEmail, setChildParentEmail] = useState("");
  const [childName, setChildName] = useState("");
  const [childPassword, setChildPassword] = useState("");
  const [showChildPassword, setShowChildPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleParentSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrors({});

    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);
      const userRole = response.data?.user?.role;
      if (userRole !== 'parent') {
        setErrors({ submit: "Only parent accounts can login." });
        setIsLoading(false);
        return;
      }
      initializeUserProfileWithFamily();
      setSuccessMessage("Login successful!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Login failed.";
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChildSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrors({});

    if (!childParentEmail.trim()) {
      setErrors({ parentEmail: "Parent email is required" });
      return;
    }
    if (!childName.trim()) {
      setErrors({ childName: "Child name is required" });
      return;
    }
    if (!childPassword) {
      setErrors({ password: "Password is required" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentEmail: childParentEmail.trim().toLowerCase(),
          childName: childName.trim(),
          password: childPassword,
          role: 'child',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Child login failed');
      }

      const data = await response.json();
      const token = data.data?.token || data.token;
      let user = data.data?.user;
      
      // Normalize user to have 'id' field for frontend consistency
      if (user && user._id && !user.id) {
        user.id = user._id;
      }
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', 'child');
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      setSuccessMessage("Login successful!");
      setTimeout(() => navigate("/child-dashboard"), 1500);
    } catch (err) {
      const errorMessage = err.message || 'Login failed.';
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fef9e7] to-[#ece7d4]">
      <div className="flex-1 flex flex-col items-center justify-center p-4 w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <img src={Logo} alt="TinySteps" className="w-16 h-16 mx-auto mb-4 rounded-xl" />
          <h1 className="text-4xl font-bold text-[#2c3e50]">Welcome Back!</h1>
          <p className="text-[#666] text-lg mt-2">Ready for another day of little adventures?</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border-2 border-[#f2a61c]/20"
        >
          <div className="flex gap-3 mb-6 bg-gray-100 p-1 rounded-full">
            <button
              type="button"
              onClick={() => {
                setLoginMode("parent");
                setErrors({});
                setSuccessMessage("");
              }}
              disabled={isLoading}
              className={`flex-1 py-2 px-4 font-semibold rounded-full transition-all ${
                loginMode === "parent"
                  ? "bg-gradient-to-r from-[#f5a623] to-[#e8942b] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              } disabled:opacity-50`}
            >
              👨‍👩 Parent
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode("child");
                setErrors({});
                setSuccessMessage("");
              }}
              disabled={isLoading}
              className={`flex-1 py-2 px-4 font-semibold rounded-full transition-all ${
                loginMode === "child"
                  ? "bg-gradient-to-r from-[#6db938] to-[#5aa936] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              } disabled:opacity-50`}
            >
              🧒 Child
            </button>
          </div>

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg text-green-700 font-semibold text-sm"
            >
              ✅ {successMessage}
            </motion.div>
          )}

          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg text-red-700 font-semibold text-sm"
            >
              ❌ {errors.submit}
            </motion.div>
          )}

          {loginMode === "parent" && (
            <motion.form
              key="parent-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleParentSubmit}
              className="space-y-6"
            >
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <label className="block text-sm font-bold text-[#2c3e50] mb-2">Parent Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-[#f5a623] w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    required
                    disabled={isLoading}
                    className={`w-full pl-12 pr-4 py-3 bg-[#fffacd] border-2 rounded-xl focus:outline-none transition-all text-[#2c3e50] disabled:opacity-50 ${
                      errors.email ? "border-red-500" : "border-[#f5e499] focus:border-[#f5a623]"
                    }`}
                    placeholder="your.email@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-600 text-xs font-semibold mt-1">❌ {errors.email}</p>}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <label className="block text-sm font-bold text-[#2c3e50] mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-[#f5a623] w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: "" });
                    }}
                    required
                    disabled={isLoading}
                    className={`w-full pl-12 pr-12 py-3 bg-[#fffacd] border-2 rounded-xl focus:outline-none transition-all text-[#2c3e50] disabled:opacity-50 ${
                      errors.password ? "border-red-500" : "border-[#f5e499] focus:border-[#f5a623]"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-4 top-3.5 text-[#f5a623] hover:text-[#e8942b] disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-600 text-xs font-semibold mt-1">❌ {errors.password}</p>}
              </motion.div>

              <motion.button
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#f5a623] to-[#e8942b] text-white font-bold py-3 rounded-full hover:shadow-lg transition-all disabled:opacity-50 text-lg"
              >
                {isLoading ? "Logging in..." : "Let's Go! 🚀"}
              </motion.button>
            </motion.form>
          )}

          {loginMode === "child" && (
            <motion.form
              key="child-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleChildSubmit}
              className="space-y-6"
            >
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <label className="block text-sm font-bold text-[#2c3e50] mb-2">Parent Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-[#6db938] w-5 h-5" />
                  <input
                    type="email"
                    value={childParentEmail}
                    onChange={(e) => {
                      setChildParentEmail(e.target.value);
                      if (errors.parentEmail) setErrors({ ...errors, parentEmail: "" });
                    }}
                    required
                    disabled={isLoading}
                    className={`w-full pl-12 pr-4 py-3 bg-[#e8f5e9] border-2 rounded-xl focus:outline-none transition-all text-[#2c3e50] disabled:opacity-50 ${
                      errors.parentEmail ? "border-red-500" : "border-[#a5d6a7] focus:border-[#6db938]"
                    }`}
                    placeholder="parent@email.com"
                  />
                </div>
                {errors.parentEmail && <p className="text-red-600 text-xs font-semibold mt-1">❌ {errors.parentEmail}</p>}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <label className="block text-sm font-bold text-[#2c3e50] mb-2">Your Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-2xl">👶</span>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => {
                      setChildName(e.target.value);
                      if (errors.childName) setErrors({ ...errors, childName: "" });
                    }}
                    required
                    disabled={isLoading}
                    className={`w-full pl-12 pr-4 py-3 bg-[#e8f5e9] border-2 rounded-xl focus:outline-none transition-all text-[#2c3e50] disabled:opacity-50 ${
                      errors.childName ? "border-red-500" : "border-[#a5d6a7] focus:border-[#6db938]"
                    }`}
                    placeholder="Enter your name"
                  />
                </div>
                {errors.childName && <p className="text-red-600 text-xs font-semibold mt-1">❌ {errors.childName}</p>}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <label className="block text-sm font-bold text-[#2c3e50] mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-[#6db938] w-5 h-5" />
                  <input
                    type={showChildPassword ? "text" : "password"}
                    value={childPassword}
                    onChange={(e) => {
                      setChildPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: "" });
                    }}
                    required
                    disabled={isLoading}
                    className={`w-full pl-12 pr-12 py-3 bg-[#e8f5e9] border-2 rounded-xl focus:outline-none transition-all text-[#2c3e50] disabled:opacity-50 ${
                      errors.password ? "border-red-500" : "border-[#a5d6a7] focus:border-[#6db938]"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowChildPassword(!showChildPassword)}
                    disabled={isLoading}
                    className="absolute right-4 top-3.5 text-[#6db938] hover:text-[#5aa936] disabled:opacity-50"
                  >
                    {showChildPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-600 text-xs font-semibold mt-1">❌ {errors.password}</p>}
              </motion.div>

              <motion.button
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#6db938] to-[#5aa936] text-white font-bold py-3 rounded-full hover:shadow-lg transition-all disabled:opacity-50 text-lg"
              >
                {isLoading ? "Logging in..." : "Let's Play! 🎮"}
              </motion.button>
            </motion.form>
          )}

          <div className="text-center pt-4 border-t border-[#e8e5d8] space-y-3">
            <p className="text-[#666] text-sm">Don't have an account?</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => navigate("/signup")}
              disabled={isLoading}
              className="w-full px-6 py-2 bg-[#7cc9f7] text-white font-semibold rounded-full hover:bg-[#0d5a7a] transition-colors disabled:opacity-50"
            >
              👨‍👩 Create Parent Account
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => navigate("/child-signup")}
              disabled={isLoading}
              className="w-full px-6 py-2 bg-[#6db938] text-white font-semibold rounded-full hover:bg-[#5aa936] transition-colors disabled:opacity-50"
            >
              🧒 Create Child Account
            </motion.button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
