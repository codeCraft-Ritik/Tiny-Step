import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Scale, AlertCircle, FileText, CheckCircle, Info, Mail } from "lucide-react";
import Logo from "../assets/Logo.png";
import Footer from "../components/Footer";

const TermsOfService = () => {
  const navigate = useNavigate();

  const sections = [
    { id: 1, title: "Acceptance of Terms", icon: "✅" },
    { id: 2, title: "Use License", icon: "📋" },
    { id: 3, title: "Disclaimer", icon: "⚠️" },
    { id: 4, title: "Limitations", icon: "🚫" },
    { id: 5, title: "Accuracy of Materials", icon: "✓" },
    { id: 6, title: "Links", icon: "🔗" },
    { id: 7, title: "Modifications", icon: "📝" },
    { id: 8, title: "Governing Law", icon: "⚖️" },
    { id: 9, title: "Contact Us", icon: "📞" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef9e7] via-[#f5f1e0] to-[#f0eadb]">
      {/* Decorative background elements */}
      <motion.div
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="fixed top-20 right-0 w-96 h-96 bg-gradient-to-bl from-[#f2a61c]/10 to-transparent rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="fixed bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#7cc9f7]/10 to-transparent rounded-full blur-3xl pointer-events-none"
      />

      {/* Navigation */}
      <nav className="fixed inset-x-0 top-0 z-40 border-b border-[#d8d3be] bg-[#e8e5d8e8] backdrop-blur">
        <div className="mx-auto flex h-20 w-[min(1200px,92vw)] items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-[#3b3a2a] font-semibold hover:text-[#f2a61c] transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img src={Logo} alt="TinySteps" className="w-12 h-12 rounded-lg shadow-md" />
              <span className="text-2xl font-extrabold text-[#3b3a2a]">
                Tiny<span className="text-[#f2a61c]">Steps</span>
              </span>
            </motion.div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm font-semibold text-[#666]">
            <Scale className="w-4 h-4 text-[#f2a61c]" />
            <span>Legally Binding Agreement</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-12 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-[min(1000px,92vw)] text-center space-y-6"
        >
          <div className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#f2a61c]/20 to-[#7cc9f7]/20 border border-[#f2a61c]/40 rounded-full px-6 py-3">
            <Scale className="w-5 h-5 text-[#f2a61c]" />
            <span className="text-sm font-bold text-[#2c3e50]">For Busy Parents, By Parents</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black bg-linear-to-r from-[#2c3e50] via-[#f2a61c] to-[#7cc9f7] bg-clip-text text-transparent">
            Terms of Service
          </h1>

          <p className="text-xl text-[#666] max-w-2xl mx-auto leading-relaxed">
            TinySteps Parent Management Platform helps busy parents manage their children's routines and discipline. Please read these terms carefully.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="bg-white rounded-xl px-6 py-3 shadow-md border border-[#d8d3be]">
              <p className="text-sm text-[#666]"><strong>Last Updated:</strong> April 2, 2026</p>
            </div>
            <div className="bg-white rounded-xl px-6 py-3 shadow-md border border-[#d8d3be]">
              <p className="text-sm text-[#666]"><strong>Version:</strong> 1.0</p>
            </div>
            <div className="bg-white rounded-xl px-6 py-3 shadow-md border border-[#d8d3be]">
              <p className="text-sm text-[#666]"><strong>Type:</strong> Binding Agreement</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Important Notice */}
      <div className="mx-auto w-[min(1000px,92vw)] mb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-yellow-50 border-l-4 border-l-yellow-500 rounded-xl p-6 shadow-lg flex gap-4"
        >
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-yellow-900 mb-2">Important: Please Read These Terms</h3>
            <p className="text-yellow-800 text-sm">
              These Terms of Service constitute a legally binding agreement between you and TinySteps. By using our platform, you acknowledge that you have read, understood, and agree to be bound by all provisions herein.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Table of Contents */}
      <div className="mx-auto w-[min(1000px,92vw)] mb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-[#d8d3be]"
        >
          <h2 className="text-2xl font-bold text-[#2c3e50] mb-6 flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#f2a61c]" />
            Table of Contents
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {sections.map((section) => (
              <motion.a
                key={section.id}
                href={`#section-${section.id}`}
                whileHover={{ x: 10 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#fef9e7] transition group"
              >
                <span className="text-2xl group-hover:scale-110 transition">{section.icon}</span>
                <span className="text-[#2c3e50] font-semibold text-sm">{section.id}. {section.title}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Content Sections */}
      <div className="mx-auto w-[min(1000px,92vw)] pb-12 space-y-8">
        {/* Section 1 */}
        <motion.section
          id="section-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-l-[#9ce05f]"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="text-5xl">✅</div>
            <div>
              <h2 className="text-3xl font-bold text-[#2c3e50]">1. Acceptance of Terms</h2>
              <p className="text-[#999] text-sm mt-1">Your agreement to these legally binding terms</p>
            </div>
          </div>
          <p className="text-[#555] leading-relaxed text-lg bg-blue-50 p-4 rounded-lg border-l-4 border-l-blue-400">
            By accessing and using TinySteps Parent Management Platform, you accept and agree to be bound by these terms. TinySteps is designed for parents and guardians to manage their children's daily routines, track discipline, and monitor learning activities. You are responsible for supervising all child accounts linked to your parent account.
          </p>
        </motion.section>

        {/* Section 2 */}
        <motion.section
          id="section-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-l-[#7cc9f7]"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="text-5xl">📋</div>
            <div>
              <h2 className="text-3xl font-bold text-[#2c3e50]">2. Use License</h2>
              <p className="text-[#999] text-sm mt-1">What you're allowed to do with TinySteps</p>
            </div>
          </div>
          <p className="text-[#555] leading-relaxed mb-6">
            As a parent/guardian, you have a personal, non-transferable license to use TinySteps to manage your child's routine, discipline tracking, and learning activities. This license grants you the ability to create and manage child profiles, set rules, monitor activities, and enforce discipline through our platform.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
              <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">🚫</span> Prohibited Use:
              </h4>
              <ul className="space-y-2 text-sm text-red-800">
                <li>✗ Sharing account with non-guardians</li>
                <li>✗ Using platform to harm children</li>
                <li>✗ Bypassing parental controls</li>
                <li>✗ Reverse engineering features</li>
                <li>✗ Commercial resale of platform</li>
              </ul>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
              <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">✅</span> Permitted Use:
              </h4>
              <ul className="space-y-2 text-sm text-green-800">
                <li>✓ Create multiple child profiles</li>
                <li>✓ Set routines and discipline rules</li>
                <li>✓ Monitor activities & progress</li>
                <li>✓ Manage screen time limits</li>
                <li>✓ Create accountability systems</li>
              </ul>
            </motion.div>
          </div>
        </motion.section>

        {/* Section 3 */}
        <motion.section
          id="section-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 shadow-lg border-l-4 border-l-red-500"
        >
          <div className="flex items-start gap-4">
            <div className="text-5xl">⚠️</div>
            <div>
              <h2 className="text-3xl font-bold text-[#2c3e50] mb-4">3. Disclaimer</h2>
              <div className="bg-white rounded-xl p-6">
                <p className="text-[#555] leading-relaxed">
                  The materials on TinySteps are provided <strong>"as is"</strong>. TinySteps makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 4 */}
        <motion.section
          id="section-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-l-[#f2a61c]"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="text-5xl">🚫</div>
            <div>
              <h2 className="text-3xl font-bold text-[#2c3e50]">4. Limitations of Liability</h2>
              <p className="text-[#999] text-sm mt-1">Understanding our liability limitations</p>
            </div>
          </div>
          <div className="bg-orange-50 rounded-xl p-6 border-l-4 border-l-orange-400">
            <p className="text-[#555] leading-relaxed">
              TinySteps is a parental management tool and is not a substitute for active parenting, professional advice, or emergency services. We are not liable for educational outcomes, behavioral changes, or consequences of discipline decisions made by parents using our platform. Parents remain fully responsible for their children's welfare and safety.
            </p>
          </div>
        </motion.section>

        {/* Section 5 */}
        <motion.section
          id="section-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-l-[#9ce05f]"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="text-5xl">✓</div>
            <div>
              <h2 className="text-3xl font-bold text-[#2c3e50]">5. Accuracy of Materials</h2>
              <p className="text-[#999] text-sm mt-1">Our commitment to quality content</p>
            </div>
          </div>
          <p className="text-[#555] leading-relaxed mb-6">
            While TinySteps is regularly updated and maintained, we do not guarantee that all content, routines, or discipline recommendations are perfectly accurate or suitable for every child. Parents should adapt recommendations to their child's individual needs, age, and development level.
          </p>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="font-semibold text-blue-900 mb-2">📌 Our Commitment</p>
            <p className="text-blue-800 text-sm">We regularly update our platform with new research on child development and parenting. If you find inaccuracies, please report them immediately to improve our service.</p>
          </div>
        </motion.section>

        {/* Section 6 */}
        <motion.section
          id="section-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-l-[#7cc9f7]"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="text-5xl">🔗</div>
            <div>
              <h2 className="text-3xl font-bold text-[#2c3e50]">6. External Links</h2>
              <p className="text-[#999] text-sm mt-1">About third-party websites</p>
            </div>
          </div>
          <p className="text-[#555] leading-relaxed mb-6">
            TinySteps has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by TinySteps of the site. Use of any such linked website is at the user's own risk.
          </p>
          <motion.div whileHover={{ y: -5 }} className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <p className="font-semibold text-purple-900 mb-2">⚡ Important Note</p>
            <p className="text-purple-800 text-sm">We are not responsible for external content. Always review third-party privacy policies before sharing information.</p>
          </motion.div>
        </motion.section>

        {/* Section 7 */}
        <motion.section
          id="section-7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-l-[#f2a61c]"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="text-5xl">📝</div>
            <div>
              <h2 className="text-3xl font-bold text-[#2c3e50]">7. Modifications to Terms</h2>
              <p className="text-[#999] text-sm mt-1">We may update these terms</p>
            </div>
          </div>
          <p className="text-[#555] leading-relaxed">
            TinySteps may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service. We recommend reviewing these terms periodically for updates.
          </p>
        </motion.section>

        {/* Section 8 */}
        <motion.section
          id="section-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-lg border-l-4 border-l-indigo-500"
        >
          <div className="flex items-start gap-4">
            <div className="text-5xl">⚖️</div>
            <div>
              <h2 className="text-3xl font-bold text-[#2c3e50] mb-4">8. Governing Law</h2>
              <div className="bg-white rounded-xl p-6">
                <p className="text-[#555] leading-relaxed">
                  These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction where TinySteps is located, and you irrevocably submit to the exclusive jurisdiction of the courts in that location. Any legal action or proceeding shall be resolved according to these governing laws.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 9 */}
        <motion.section
          id="section-9"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-gradient-to-br from-[#7cc9f7] to-[#9ce05f] rounded-2xl p-12 shadow-2xl"
        >
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6 text-6xl">📞</div>
            <h2 className="text-4xl font-bold text-white mb-4">Questions About These Terms?</h2>
            <p className="text-white text-lg mb-8 leading-relaxed">
              If you have questions about these Terms of Service, need clarification, or want to report a violation, please contact our legal team. We're committed to fair and transparent interactions.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-4 sm:p-6 inline-block w-full max-w-md"
            >
              <p className="text-[#2c3e50] font-semibold mb-2 flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Us
              </p>
              <p className="text-[#666] text-sm sm:text-lg font-bold break-words text-center">support@tinysteps.com</p>
              <p className="text-[#999] text-xs sm:text-sm mt-2">We'll respond within 24 business hours</p>
            </motion.div>
          </div>
        </motion.section>

        {/* Agreement Confirmation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-300 shadow-lg"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <h3 className="text-2xl font-bold text-green-900">Agreement Summary</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg p-4">
              <p className="text-2xl font-bold text-green-600">9</p>
              <p className="text-sm text-gray-600">Key Sections</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-2xl font-bold text-green-600">100%</p>
              <p className="text-sm text-gray-600">Legally Binding</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-2xl font-bold text-green-600">Clear</p>
              <p className="text-sm text-gray-600">Easy to Understand</p>
            </div>
          </div>
          <p className="text-center text-green-800 mt-6 text-sm">
            <strong>By using TinySteps, you acknowledge that you have read and agree to these Terms of Service.</strong>
          </p>
        </motion.div>

        {/* Last Updated Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="bg-white rounded-xl p-6 text-center border-2 border-dashed border-[#d8d3be]"
        >
          <p className="text-[#666] text-sm">
            <strong>Last Updated:</strong> April 2, 2026 | <strong>Version:</strong> 1.0 | <strong>Effective Date:</strong> April 2, 2026 | <strong>Type:</strong> Legally Binding Agreement
          </p>
        </motion.div>
      </div>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="mx-auto w-[min(1000px,92vw)] mb-12 text-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-[#7cc9f7] via-[#9ce05f] to-[#f2a61c] text-white font-bold py-4 px-8 rounded-full shadow-lg text-lg hover:shadow-2xl transition"
        >
          ← Back to Home
        </motion.button>
      </motion.div>

      <Footer />
    </div>
  );
};

export default TermsOfService;
