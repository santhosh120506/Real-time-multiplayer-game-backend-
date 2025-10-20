import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signin } from '/src/services/authService';
import Navbar from '/src/components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    try {
      await signin(email, password, navigate);
      setMessage({ text: 'Logged in successfully!', type: 'success' });
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold" style={{ color: '#5D64F9' }}>Welcome Back!</h2>
            <p className="text-gray-400">Sign in to continue playing</p>
          </div>

          {/* Display success or error message */}
          {message.text && (
            <div
              className={`text-center p-2 mb-4 rounded ${
                message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleLogin} className="game-card space-y-6">
            <div>
              <label className="form-label" htmlFor="email">
                Email
              </label>
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
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                className="input-field"
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="game-button w-full" type="submit">Sign In</button>
            <div className="text-center text-gray-400">
              Need an account?{' '}
              <Link to="/register" className="text-green-500 hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
