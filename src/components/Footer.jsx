import Logo from "../assets/Logo.png";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 lg:py-16 border-t-4 border-[#f2a61c] w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Main Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-8 lg:mb-12">
            {/* Brand Section */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img src={Logo} alt="TinySteps" className="h-8 w-8 rounded-lg flex-shrink-0" />
                <span className="text-xl sm:text-2xl font-black whitespace-nowrap">
                  Tiny<span className="text-[#f2a61c]">Steps</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed pr-2">
                Transforming daily routines into exciting adventures for families everywhere.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-black text-sm uppercase mb-4 text-[#f2a61c] tracking-wide">
                Quick Links
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li><a href="/" className="text-gray-400 hover:text-[#f2a61c] transition duration-200">Home</a></li>
                <li><a href="/about" className="text-gray-400 hover:text-[#f2a61c] transition duration-200">About</a></li>
                <li><a href="/privacy" className="text-gray-400 hover:text-[#f2a61c] transition duration-200">Privacy Policy</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-[#f2a61c] transition duration-200">Terms of Service</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-black text-sm uppercase mb-4 text-[#f2a61c] tracking-wide">
                Support
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-[#f2a61c] transition duration-200">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#f2a61c] transition duration-200">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#f2a61c] transition duration-200">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#f2a61c] transition duration-200">Blog</a></li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-white font-black text-sm uppercase mb-4 text-[#f2a61c] tracking-wide">
                Follow Us
              </h3>
              <div className="flex gap-4">
                <a
                  href="https://github.com/codeCraft-Ritik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#f2a61c] rounded-lg flex items-center justify-center text-black hover:scale-110 transition-transform duration-200 flex-shrink-0"
                  title="GitHub"
                >
                  <FaGithub className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/ritikkumar-21dec"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#f2a61c] rounded-lg flex items-center justify-center text-black hover:scale-110 transition-transform duration-200 flex-shrink-0"
                  title="LinkedIn"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Divider & Copyright */}
          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
              &copy; 2026 TinySteps. All rights reserved. | Designed with 💚 for families
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
