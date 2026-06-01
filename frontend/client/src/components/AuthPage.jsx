import React, { useState, useContext, useEffect } from 'react';
import api from '../api';
import { AuthContext } from '../AuthContext';
import { motion } from 'framer-motion';

export default function AuthPage({ onBack, onSuccess, onEnterGuest }) {
  const initialMode = localStorage.getItem('auth_initial_mode') || 'login';
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('organizer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { save } = useContext(AuthContext);

  useEffect(() => {
    setError('');
    setUsername('');
    setEmail('');
    setPassword('');
    setRole('organizer');
  }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.post('/api/auth/login', { email, password });
        save(res.data.token, res.data.user);
      } else {
        const res = await api.post('/api/auth/signup', { username, email, password, role });
        save(res.data.token, res.data.user);
      }
      onSuccess();
    } catch (err) {
      console.error('Auth action failed:', err);
      const serverMessage = err.response?.data?.message || err.response?.data?.error;
      const fallback = mode === 'login'
        ? 'Login failed. Please verify your credentials.'
        : 'Registration failed. Please check the entered details.';
      setError(serverMessage || err.message || fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row bg-[#f6fbfb] animate-fadeIn">
      {/* Back Button Overlay */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-white/80 hover:bg-white text-gray-700 font-bold px-4 py-2 rounded-xl shadow-md border border-gray-100 hover:scale-105 active:scale-95 transition cursor-pointer text-sm"
      >
        ← Back
      </button>

      {/* Left Column: Visual branding and description */}
      <div className="lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 text-white flex flex-col justify-between p-12 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-teal-400/20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-300/10 blur-3xl" />

        {/* Top spacer or logo */}
        <div className="flex items-center gap-3 relative z-10">
          <span className="text-3xl">🎉</span>
          <span className="text-xl font-black tracking-wide">Event Planner Hub</span>
        </div>

        {/* Middle copy */}
        <div className="my-auto max-w-lg relative z-10 space-y-6">
          <h2 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight">
            Design, Manage, and Live-stream Your Perfect Events.
          </h2>
          <p className="text-teal-100 font-medium text-base leading-relaxed">
            Join thousands of hosts managing guest lists, checking RSVPs in real time, staying on top of task lists, and planning budgets from one beautiful dashboard. Click any feature below to try it in guest sandbox mode!
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-bold text-teal-50">
            <motion.button 
              onClick={() => onEnterGuest('tasks')}
              whileHover={{ scale: 1.04, y: -2, backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
              className="flex items-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10 hover:border-white/25 text-left w-full cursor-pointer outline-none shadow-sm hover:shadow-md"
            >
              <span className="text-lg">📋</span> Task Checklists
            </motion.button>
            <motion.button 
              onClick={() => onEnterGuest('budget')}
              whileHover={{ scale: 1.04, y: -2, backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
              className="flex items-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10 hover:border-white/25 text-left w-full cursor-pointer outline-none shadow-sm hover:shadow-md"
            >
              <span className="text-lg">💰</span> Budget Planners
            </motion.button>
            <motion.button 
              onClick={() => onEnterGuest('guests')}
              whileHover={{ scale: 1.04, y: -2, backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
              className="flex items-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10 hover:border-white/25 text-left w-full cursor-pointer outline-none shadow-sm hover:shadow-md"
            >
              <span className="text-lg">🧑‍🤝‍🧑</span> Guest Tracking
            </motion.button>
            <motion.button 
              onClick={() => onEnterGuest('dashboard')}
              whileHover={{ scale: 1.04, y: -2, backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
              className="flex items-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10 hover:border-white/25 text-left w-full cursor-pointer outline-none shadow-sm hover:shadow-md"
            >
              <span className="text-lg">💬</span> Discussion Boards
            </motion.button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-teal-200/60 font-semibold relative z-10">
          Simplify your event coordination process today.
        </div>
      </div>

      {/* Right Column: Sleek Authentication Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-[#f0fdfa] via-[#e6fcf5] to-[#f4fbf8]">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-teal-50/50 p-8 rounded-3xl shadow-xl space-y-6">
          
          <div>
            <h3 className="text-3xl font-black text-gray-800 tracking-tight">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h3>
            <p className="text-xs text-gray-400 font-bold mt-1">
              {mode === 'login' ? 'Please log in to your account to continue.' : 'Get started by creating your account in seconds.'}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-2xl">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all duration-200 cursor-pointer ${
                mode === 'login' 
                  ? 'bg-white text-teal-800 shadow-sm border border-gray-100' 
                  : 'text-gray-500 hover:text-gray-800 border border-transparent'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all duration-200 cursor-pointer ${
                mode === 'signup' 
                  ? 'bg-white text-teal-800 shadow-sm border border-gray-100' 
                  : 'text-gray-500 hover:text-gray-800 border border-transparent'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100/50 text-rose-600 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Username</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-gray-400 text-sm">👤</span>
                  <input
                    type="text"
                    required
                    placeholder="yourusername"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs bg-white/70"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400 text-sm">✉️</span>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs bg-white/70"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Password</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400 text-sm">🔒</span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs bg-white/70"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Register As</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs bg-white/70 cursor-pointer font-bold"
                >
                  <option value="organizer">Event Organizer</option>
                  <option value="attendee">Event Attendee</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2cb67d] hover:bg-[#209c68] text-white font-bold py-3 rounded-2xl shadow-lg shadow-[#2cb67d]/20 hover:shadow-[#2cb67d]/35 hover:-translate-y-[1px] active:translate-y-0 transform transition duration-150 text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="text-center text-xs text-gray-400 font-semibold">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button 
                  onClick={() => setMode('signup')}
                  className="text-teal-600 font-extrabold hover:underline bg-transparent border-none p-0 cursor-pointer"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button 
                  onClick={() => setMode('login')}
                  className="text-teal-600 font-extrabold hover:underline bg-transparent border-none p-0 cursor-pointer"
                >
                  Login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
