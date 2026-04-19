import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ChildSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [parentEmail, setParentEmail] = useState('');
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Step 1: Verify parent email and load children
  const handleVerifyParent = async (e) => {
    e.preventDefault();
    if (!parentEmail.trim()) {
      setError('Please enter your parent email');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/family/children/by-email?parentEmail=${encodeURIComponent(parentEmail)}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000,
        }
      );

      if (!response.ok) {
        throw new Error('Parent email not found or has no children');
      }

      const data = await response.json();
      if (data.children && data.children.length > 0) {
        setChildren(data.children);
        setStep(2);
        setSuccessMessage('Parent verified! Select your name below.');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError('No children found for this parent email. Please add your child in Parent Dashboard first.');
      }
    } catch (err) {
      setError(err.message || 'Failed to verify parent email');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Select child
  const handleSelectChild = (child) => {
    setSelectedChild(child);
    setStep(3);
    setError('');
  };

  // Step 3: Create password and signup
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Please enter a password');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/signup`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            parentEmail,
            childName: selectedChild.name,
            password,
            confirmPassword,
            role: 'child',
          }),
          timeout: 15000,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      const data = await response.json();
      // API returns data.data.token
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
      
      setSuccessMessage('Account created successfully!');
      setTimeout(() => {
        navigate('/child-dashboard');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // Progress indicator
  const progressPercentage = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">Welcome! 👋</h1>
          <p className="text-gray-600 text-lg">Create your child account</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-700">Step {step} of 3</span>
            <span className="text-xs text-gray-500">
              {step === 1 && 'Verify Parent Email'}
              {step === 2 && 'Select Your Name'}
              {step === 3 && 'Create Password'}
            </span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: `${(step - 1) * 33.33}%` }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full"
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm"
          >
            {successMessage}
          </motion.div>
        )}

        {/* Step 1: Parent Email Verification */}
        {step === 1 && (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleVerifyParent}
            className="bg-white p-8 rounded-2xl shadow-lg"
          >
            <label className="block mb-4">
              <span className="text-gray-700 font-semibold block mb-2">Parent Email Address</span>
              <input
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                placeholder="your-parent@email.com"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                disabled={loading}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Verifying...
                </>
              ) : (
                'Verify & Continue'
              )}
            </button>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have a parent account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Parent Signup
                </button>
              </p>
            </div>
          </motion.form>
        )}

        {/* Step 2: Select Child */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-8 rounded-2xl shadow-lg"
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Your Name</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {children.map((child) => (
                  <motion.button
                    key={child.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleSelectChild(child)}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition text-left font-semibold text-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👶</span>
                      <div>
                        <div>{child.name}</div>
                        {child.age && <div className="text-xs text-gray-500">Age: {child.age}</div>}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setError('');
              }}
              className="w-full text-indigo-600 font-semibold py-2 hover:bg-indigo-50 rounded-lg transition"
            >
              ← Go Back
            </button>
          </motion.div>
        )}

        {/* Step 3: Create Password */}
        {step === 3 && (
          <motion.form
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleCreateAccount}
            className="bg-white p-8 rounded-2xl shadow-lg"
          >
            <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Selected Child:</strong> <span className="text-indigo-600 font-semibold">{selectedChild?.name}</span>
              </p>
            </div>

            <label className="block mb-4">
              <span className="text-gray-700 font-semibold block mb-2">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                disabled={loading}
              />
            </label>

            <label className="block mb-6">
              <span className="text-gray-700 font-semibold block mb-2">Confirm Password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                disabled={loading}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(2);
                setError('');
              }}
              className="w-full text-indigo-600 font-semibold py-2 hover:bg-indigo-50 rounded-lg transition"
            >
              ← Go Back
            </button>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
}
