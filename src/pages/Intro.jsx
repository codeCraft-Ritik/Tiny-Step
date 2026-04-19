import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X, Menu, ChevronLeft, ChevronRight } from "lucide-react";
import Logo from "../assets/Logo.png";
import Footer from "../components/Footer";

const Intro = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const sectionFade = useMemo(
    () => ({
      hidden: { opacity: 0, y: 26 },
      show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    }),
    []
  );

  const steps = [
    {
      number: 1,
      title: "Create Tasks",
      emoji: "📝",
      description: "Set up daily routines and chores as fun, gamified tasks for your kids.",
      gradient: "from-[#f2a61c] to-[#d98d0f]"
    },
    {
      number: 2,
      title: "Kids Play & Learn",
      emoji: "🎮",
      description: "Children complete tasks, earn stickers, and unlock exciting rewards in their adventure.",
      gradient: "from-[#7cc9f7] to-[#5bb5e3]"
    },
    {
      number: 3,
      title: "Track Progress",
      emoji: "📊",
      description: "Monitor real-time progress and insights on your parent dashboard.",
      gradient: "from-[#9ce05f] to-[#8ad74a]"
    },
    {
      number: 4,
      title: "Celebrate Wins",
      emoji: "🎉",
      description: "Celebrate milestones together and watch healthy habits stick!",
      gradient: "from-[#ff6b6b] to-[#ee5a52]"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed inset-x-0 top-0 z-50 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="TinySteps" className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg" />
            <span className="text-lg sm:text-2xl font-black text-black">
              Tiny<span className="text-[#f2a61c]">Steps</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-[#f2a61c] hover:text-[#d98d0f] transition">Features</a>
            <a href="#how" className="text-sm font-semibold text-gray-700 hover:text-black transition">How it Works</a>
            <button onClick={() => navigate("/about")} className="text-sm font-semibold text-gray-700 hover:text-black transition bg-none border-none cursor-pointer">About</button>
            <button onClick={() => navigate("/login")} className="text-sm font-semibold text-gray-700 hover:text-black transition bg-none border-none cursor-pointer">Login</button>
            <button onClick={() => setShowAuthModal(true)} className="px-5 py-2.5 bg-[#f2a61c] text-white font-bold rounded-full hover:bg-[#d98d0f] transition">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu className="w-6 h-6 text-black" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-3">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-[#f2a61c] hover:text-[#d98d0f] py-2">Features</a>
              <a href="#how" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-gray-700 hover:text-black py-2">How it Works</a>
              <button onClick={() => {
                navigate("/about");
                setMobileMenuOpen(false);
              }} className="block text-sm font-semibold text-gray-700 hover:text-black py-2 bg-none border-none cursor-pointer">About</button>
              <button onClick={() => {
                navigate("/login");
                setMobileMenuOpen(false);
              }} className="block text-sm font-semibold text-gray-700 hover:text-black py-2 bg-none border-none cursor-pointer">Login</button>
              <button onClick={() => {
                setShowAuthModal(true);
                setMobileMenuOpen(false);
              }} className="w-full px-5 py-2.5 bg-[#f2a61c] text-white font-bold rounded-full hover:bg-[#d98d0f] transition">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={sectionFade}
            >
              <span className="inline-block px-3 sm:px-4 py-2 bg-[#9ce05f] text-[#2d5016] text-[10px] sm:text-xs font-bold rounded-full uppercase">
                The #1 Routing App for Kids
              </span>

              <h1 className="mt-4 sm:mt-6 text-3xl sm:text-5xl lg:text-6xl leading-tight font-black text-black">
                Small Steps, <span className="text-[#f2a61c]">Giant Leaps</span> for Your Little Explorer.
              </h1>

              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg">
                Transform daily chores into an interstellar adventure. TinySteps helps children build healthy habits through play, stickers, and rocket-fueled motivation.
              </p>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAuthModal(true)}
                  className="w-full sm:w-auto px-6 py-3 sm:py-3.5 bg-gray-900 text-white font-bold rounded-full hover:bg-black transition text-sm sm:text-base"
                >
                  Start the Adventure
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-6 py-3 sm:py-3.5 bg-[#7cc9f7] text-white font-bold rounded-full hover:bg-[#5bb5e3] transition flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  📺 See the Magic
                </motion.button>
              </div>
            </motion.div>

            {/* Right Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative flex justify-center"
            >
              <div className="relative w-64 h-64 sm:w-96 sm:h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2d7a7a] to-[#1a4d4d] rounded-[40px] overflow-hidden shadow-2xl">
                  {/* Placeholder for illustration - two kids with tablet */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3a8f8f] to-[#1f5a5a]">
                    <div className="text-center">
                      <div className="text-6xl sm:text-8xl mb-4">👦👧</div>
                      <div className="text-4xl sm:text-6xl">📱</div>
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-6 -right-6 w-20 h-20 sm:w-24 sm:h-24 bg-[#9ce05f] rounded-full shadow-lg flex items-center justify-center text-3xl sm:text-4xl cursor-pointer"
                >
                  ✨
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#fffacd]">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={sectionFade}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black">
              Built for Big <span className="text-[#f2a61c]">Imaginations</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto px-2">
              We've turned boring routines into the highlight of the day. No more nagging—just pure excitement!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-gray-100 h-full"
            >
              <div className="text-4xl sm:text-5xl mb-4">⚡</div>
              <h3 className="text-lg sm:text-2xl font-black text-black">The Magic Task Creator</h3>
              <p className="mt-3 text-sm sm:text-base text-gray-600">
                Turn routines into stickers and games. Every morning task becomes a quest to collect digital rewards.
              </p>
            </motion.div>

            {/* Feature 2 - Large Blue Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-[#7cc9f7] to-[#5bb5e3] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg text-white h-full"
            >
              <div className="flex flex-col sm:flex-row justifybetween items-start gap-4">
                <div className="flex-1">
                  <div className="text-4xl sm:text-5xl mb-4">🚀</div>
                  <h3 className="text-lg sm:text-2xl font-black">Adventure Mode</h3>
                  <p className="mt-3 text-sm sm:text-base text-white/90">
                    Kids race against time with a rocket tracker. Finish a task, search to the next planet!
                  </p>
                </div>
                <div className="text-6xl sm:text-8xl opacity-20 hidden sm:block">📱</div>
              </div>
            </motion.div>

            {/* Feature 3 & 4 - Bottom Row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-[#7ec946] to-[#6db938] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg text-white h-full"
            >
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <div className="text-4xl sm:text-5xl mb-4">📊</div>
                  <h3 className="text-lg sm:text-2xl font-black">Parent Dashboard</h3>
                  <p className="mt-3 text-sm sm:text-base text-white/90">
                    Real-time insights. See exactly when routines are completed and celebrate wins together.
                  </p>
                </div>
                <div>
                  <div className="text-4xl sm:text-5xl mb-4">💚</div>
                  <h3 className="text-lg sm:text-2xl font-black">Parent's Peace of Mind</h3>
                  <p className="mt-3 text-xs sm:text-base text-white/90">
                    Simple insights and rewards to celebrate progress. Know exactly when your little one completes a goal.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs sm:text-sm">
                    <li>✓ Real-time progress notifications</li>
                    <li>✓ Custom reward systems</li>
                    <li>✓ Morning vs Evening insights</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={sectionFade}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black">
              How it <span className="text-[#f2a61c]">Works</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto px-2">
              Get started in just 4 simple steps and watch your child thrive!
            </p>
          </motion.div>

          {/* Desktop Grid (hidden on mobile) */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className={`bg-gradient-to-br ${step.gradient} rounded-3xl p-8 text-white h-full shadow-lg`}>
                  <div className={`absolute -top-6 left-8 w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center text-4xl font-black border-4 border-white shadow-lg`}>
                    {step.number}
                  </div>
                  <div className="mt-8">
                    <div className="text-5xl mb-4">{step.emoji}</div>
                    <h3 className="text-2xl font-black">{step.title}</h3>
                    <p className="mt-3 text-white/90">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Slider (visible on mobile only) */}
          <div className="md:hidden">
            <div className="relative">
              <div className="overflow-hidden rounded-2xl">
                <motion.div
                  animate={{ x: -currentStep * 100 + "%" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="flex"
                >
                  {steps.map((step, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-2">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`bg-gradient-to-br ${step.gradient} rounded-2xl p-8 text-white shadow-lg`}
                      >
                        <div className={`w-14 h-14 bg-white/30 rounded-full flex items-center justify-center text-3xl font-black mb-6`}>
                          {step.number}
                        </div>
                        <div className="text-5xl mb-4">{step.emoji}</div>
                        <h3 className="text-2xl font-black mb-3">{step.title}</h3>
                        <p className="text-white/90 text-base leading-relaxed">
                          {step.description}
                        </p>
                      </motion.div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                disabled={currentStep === 0}
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
              </button>
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                disabled={currentStep === steps.length - 1}
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
              </button>
            </div>

            {/* Slider Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStep ? "bg-[#f2a61c] w-8" : "bg-gray-300 w-2"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 sm:mt-16 bg-[#fffacd] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center border-2 border-[#f2a61c]"
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-black">
              That's it! Simple, Fun & Effective 🚀
            </h3>
            <p className="mt-3 sm:mt-4 text-gray-700 text-sm sm:text-lg max-w-3xl mx-auto px-2">
              TinySteps turns the struggle out of daily routines and transforms them into moments of celebration. No complicated setup, no confusing interfaces—just pure family joy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#f2a61c]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={sectionFade}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white">
            Ready to Blast Off?
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-xl text-white/90 max-w-2xl mx-auto px-2">
            Join 50,000+ happy families making every morning a breeze. Start your 7-day adventure for free.
          </p>

          <div className="mt-8 sm:mt-10 flex gap-3 sm:gap-4 justify-center flex-wrap px-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuthModal(true)}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#f2a61c] font-black rounded-full hover:bg-gray-50 transition text-base sm:text-lg"
            >
              Get Started Free
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      {showAuthModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowAuthModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white shadow-2xl"
          >
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition transition z-10"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>

            <div className="bg-gradient-to-r from-[#f2a61c] to-[#d98d0f] p-6 sm:p-10 text-center">
              <img src={Logo} alt="TinySteps" className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-xl" />
              <h2 className="text-2xl sm:text-4xl font-black text-white">Welcome! 🎉</h2>
              <p className="text-white/90 font-semibold mt-1 sm:mt-2 text-sm sm:text-base">Choose your path</p>
            </div>

            <div className="p-6 sm:p-8 space-y-3 sm:space-y-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowAuthModal(false);
                  navigate("/login");
                }}
                className="w-full bg-[#7cc9f7] text-white font-black py-3 sm:py-4 rounded-lg sm:rounded-xl hover:bg-[#5bb5e3] transition text-base sm:text-lg"
              >
                🔐 Welcome Back (Login)
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowAuthModal(false);
                  navigate("/signup");
                }}
                className="w-full bg-[#9ce05f] text-white font-black py-3 sm:py-4 rounded-lg sm:rounded-xl hover:bg-[#8ad74a] transition text-base sm:text-lg"
              >
                🚀 Begin the Journey (Sign Up)
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Intro;
