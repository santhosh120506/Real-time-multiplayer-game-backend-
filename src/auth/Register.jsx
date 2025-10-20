import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup, verifyEmail, resendVerificationCode } from '/src/services/authService';
import Navbar from '/src/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion
import { X } from 'lucide-react'; // Import a close icon

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await signup(name, email, phone, password, confirmPassword);
      localStorage.setItem('tempEmail', email);
      setShowVerification(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleVerify = async () => {
    try {
      await verifyEmail(email, code);
      setMessage('Email verified successfully!');
      setTimeout(() => {
        setShowVerification(false);
        navigate('/login');
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResendCode = async () => {
    try {
      await resendVerificationCode(email);
      setMessage('Verification code resent successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  const closeVerificationPopup = () => {
    setShowVerification(false);
    setError('');
    setMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold" style={{ color: '#5D64F9' }}>Join GameHub</h2>
            <p className="text-gray-400">Create an account to get started</p>
          </div>
          <form onSubmit={handleRegister} className="game-card space-y-6">
            <div>
              <label className="form-label" htmlFor="name">Username</label>
              <input
                className="input-field"
                id="name"
                type="text"
                placeholder="Choose a username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label" htmlFor="email">Email</label>
              <input
                className="input-field"
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label" htmlFor="phone">Phone</label>
              <input
                className="input-field"
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                pattern="[0-9]{10}"
                required
              />
            </div>
            <div>
              <label className="form-label" htmlFor="password">Password</label>
              <input
                className="input-field"
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                className="input-field"
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button className="game-button w-full" type="submit">Sign Up</button>
            <div className="text-center text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-green-500 hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Verification Popup with Framer Motion */}
      <AnimatePresence>
        {showVerification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-gray-800 p-6 rounded-lg w-full max-w-md relative"
            >
              {/* Close Button */}
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                onClick={closeVerificationPopup}
              >
                <X size={24} /> {/* Close icon */}
              </button>

              <h2 className="text-3xl font-bold text-center mb-4" style={{ color: '#5D64F9' }}>
                Verify Your Email
              </h2>
              <p className="text-gray-400 text-center mb-4">
                Enter the verification code sent to {email}
              </p>
              {error && <p className="text-red-500 text-center">{error}</p>}
              {message && <p className="text-green-500 text-center">{message}</p>}
              <input
                className="input-field w-full mb-4"
                type="text"
                placeholder="Enter verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <button className="game-button w-full mb-2" onClick={handleVerify}>
                Verify
              </button>
              <button
                className="game-button w-full bg-gray-700 hover:bg-gray-600"
                onClick={handleResendCode}
              >
                Resend Code
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;