import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Shield, Users, FileText, Mail, CheckCircle } from "lucide-react";
import Logo from "../assets/Logo.png";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const sections = [
    { id: 1, title: "Information We Collect", icon: "📊" },
    { id: 2, title: "How We Use Your Information", icon: "🔍" },
    { id: 3, title: "Data Protection & Security", icon: "🔒" },
    { id: 4, title: "Children's Privacy (COPPA)", icon: "👶" },
    { id: 5, title: "Your Rights", icon: "✋" },
    { id: 6, title: "Contact Us", icon: "📞" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef9e7] via-[#f5f1e0] to-[#f0eadb]">
      {/* Decorative background elements */}
      <motion.div
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="fixed top-20 right-0 w-96 h-96 bg-gradient-to-bl from-[#9ce05f]/10 to-transparent rounded-full blur-3xl pointer-events-none"
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
            <Lock className="w-4 h-4 text-[#9ce05f]" />
            <span>GDPR & COPPA Compliant</span>
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
          <div className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#7cc9f7]/20 to-[#9ce05f]/20 border border-[#7cc9f7]/40 rounded-full px-6 py-3">
            <Shield className="w-5 h-5 text-[#7cc9f7]" />
            <span className="text-sm font-bold text-[#2c3e50]">Parent & Child Data Protection</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black bg-linear-to-r from-[#2c3e50] via-[#7cc9f7] to-[#9ce05f] bg-clip-text text-transparent">
            Privacy Policy
          </h1>

          <p className="text-xl text-[#666] max-w-2xl mx-auto leading-relaxed">
            TinySteps is a parental management platform for busy parents. We protect both your data as parents/guardians and your children's information with strict security protocols.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="bg-white rounded-xl px-6 py-3 shadow-md border border-[#d8d3be]">
              <p className="text-sm text-[#666]"><strong>Last Updated:</strong> April 2, 2026</p>
            </div>
            <div className="bg-white rounded-xl px-6 py-3 shadow-md border border-[#d8d3be]">
              <p className="text-sm text-[#666]"><strong>Version:</strong> 1.0</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Table of Contents */}
      <div className="mx-auto w-[min(1000px,92vw)] mb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-[#d8d3be]"
        >
          <h2 className="text-2xl font-bold text-[#2c3e50] mb-6 flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#f2a61c]" />
            Table of Contents
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {sections.map((section, idx) => (
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
        {/* Introduction */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-white to-[#fef9e7] rounded-2xl p-8 shadow-lg border border-[#d8d3be]"
        >
          <div className="flex items-start gap-4">
            <div className="text-5xl">🛡️</div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-[#2c3e50] mb-4">Introduction</h2>
              <p className="text-[#555] leading-relaxed text-lg">
              TinySteps ("we," "us," "our," or "Company") is committed to protecting the privacy of busy parents and their children. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use our parental management platform. Your trust in managing your family's data is fundamental to our mission.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Section 1 */}
        <motion.section
          id="section-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-l-[#9ce05f]"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="text-5xl">📊</div>
            <div>
              <h2 className="text-3xl font-bold text-[#2c3e50]">1. Information We Collect</h2>
              <p className="text-[#999] text-sm mt-1">We collect data necessary to provide you the best experience</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Parent Information", desc: "Email, password, payment details & preferences", icon: "👥" },
              { title: "Child Profile Data", desc: "Name, age, routine schedules, task history", icon: "👶" },
              { title: "Behavioral Tracking", desc: "Discipline records, goal progress, rewards earned", icon: "📊" },
              { title: "Device Information", desc: "Browser type, IP address, app usage patterns", icon: "💻" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-[#9ce05f]/10 to-[#7cc9f7]/10 rounded-xl p-4 border border-[#9ce05f]/20"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <h4 className="font-bold text-[#2c3e50] mb-2">{item.title}</h4>
                <p className="text-sm text-[#666]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
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
            <div className="text-5xl">🔍</div>
            <div>
              <h2 className="text-3xl font-bold text-[#2c3e50]">2. How We Use Your Information</h2>
              <p className="text-[#999] text-sm mt-1">Understanding how your data improves our service</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              "✅ To create and manage your child's profile & routines",
              "✅ To track discipline, tasks, and behavioral progress",
              "✅ To send notifications about tasks & achievements",
              "✅ To ensure child safety (age verification, COPPA compliance)",
              "✅ To prevent unauthorized access to parent/child data",
              "✅ To improve our parental management features"
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ x: 10 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#fef9e7] transition"
              >
                <CheckCircle className="w-5 h-5 text-[#9ce05f] flex-shrink-0" />
                <span className="text-[#555]">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Section 3 */}
        <motion.section
          id="section-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-[#7cc9f7]/10 to-[#9ce05f]/10 rounded-2xl p-8 shadow-lg border-l-4 border-l-[#f2a61c]"
        >
          <div className="flex items-start gap-4">
            <div className="text-5xl">🔒</div>
            <div>
              <h2 className="text-3xl font-bold text-[#2c3e50] mb-4">3. Data Protection & Security</h2>
              <p className="text-[#555] leading-relaxed text-lg mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Our security infrastructure includes:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="font-semibold text-[#2c3e50] mb-2">🔐 Encryption</p>
                  <p className="text-sm text-[#666]">End-to-end encryption for data in transit</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="font-semibold text-[#2c3e50] mb-2">🛡️ Access Control</p>
                  <p className="text-sm text-[#666]">Strict access controls and authentication</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="font-semibold text-[#2c3e50] mb-2">⚠️ Regular Audits</p>
                  <p className="text-sm text-[#666]">Regular security audits and testing</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="font-semibold text-[#2c3e50] mb-2">𝗠 Monitoring</p>
                  <p className="text-sm text-[#666]">24/7 security monitoring and alerts</p>
                </div>
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
          <div className="flex items-start gap-4 mb-4">
            <div className="text-5xl">👶</div>
            <div>
              <h2 className="text-3xl font-bold text-[#2c3e50]">4. Children's Privacy (COPPA Compliance)</h2>
              <p className="text-[#999] text-sm mt-1">Protecting the youngest users with utmost care</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#f2a61c]/10 to-[#9ce05f]/10 rounded-xl p-6 border border-[#f2a61c]/20">
            <p className="text-[#555] leading-relaxed mb-4">
              TinySteps is <strong>COPPA compliant and GDPR certified</strong>. We understand parents need to manage multiple children's data safely. We implement strict controls:
            </p>
            <ul className="space-y-2 text-[#555]">
              <li>✓ Only parents/guardians can access child data</li>
              <li>✓ Parental consent required for all child accounts</li>
              <li>✓ Children cannot create accounts independently</li>
              <li>✓ Age verification systems prevent underage registration</li>
              <li>✓ Full data deletion available on parental request</li>
              <li>✓ No third-party advertising or tracking</li>
              <li>✓ Secure parent authentication (2FA optional)</li>
            </ul>
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
            <div className="text-5xl">✋</div>
            <div>
              <h2 className="text-3xl font-bold text-[#2c3e50]">5. Your Rights</h2>
              <p className="text-[#999] text-sm mt-1">Full control over your personal data</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "Access & View", desc: "See all data we store about your family" },
              { title: "Correct Data", desc: "Update child info or routine details" },
              { title: "Delete Account", desc: "Permanently remove all child & parent data" },
              { title: "Download Data", desc: "Export family data in standard format" }
            ].map((right, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-[#9ce05f]/10 to-transparent rounded-xl p-4 border-2 border-[#9ce05f]/30"
              >
                <h4 className="font-bold text-[#2c3e50] mb-2">{right.title} Your Data</h4>
                <p className="text-sm text-[#666]">{right.desc}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-[#666] mt-6 text-center">
            To exercise these rights, contact us at <span className="font-semibold text-[#f2a61c]">support@tinysteps.com</span>
          </p>
        </motion.section>

        {/* Section 6 */}
        <motion.section
          id="section-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-br from-[#7cc9f7] to-[#9ce05f] rounded-2xl p-12 shadow-2xl"
        >
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6 text-6xl">📞</div>
            <h2 className="text-4xl font-bold text-white mb-6">Questions? We're Here to Help</h2>
            <p className="text-white text-lg mb-8 leading-relaxed">
              If you have any questions about our Privacy Policy or how we handle your data, don't hesitate to reach out. We're committed to transparency and will respond promptly.
            </p>
            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl p-4 sm:p-6 inline-block w-full max-w-md"
              >
                <p className="text-[#2c3e50] font-semibold mb-2 flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email
                </p>
                <p className="text-[#666] text-sm sm:text-lg font-bold break-words text-center">support@tinysteps.com</p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Last Updated Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-white rounded-xl p-6 text-center border-2 border-dashed border-[#d8d3be]"
        >
          <p className="text-[#666] text-sm">
            <strong>Last Updated:</strong> April 2, 2026 | <strong>Version:</strong> 1.0 | <strong>Effective Date:</strong> April 2, 2026
          </p>
        </motion.div>
      </div>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="mx-auto w-[min(1000px,92vw)] mb-12 text-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-[#f2a61c] via-[#f5b428] to-[#d98d0f] text-white font-bold py-4 px-8 rounded-full shadow-lg text-lg hover:shadow-2xl transition"
        >
          ← Back to Home
        </motion.button>
      </motion.div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
