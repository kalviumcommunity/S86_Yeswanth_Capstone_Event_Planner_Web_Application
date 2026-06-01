import React, { useState, useContext, useEffect } from 'react';
import api from '../api';
import { AuthContext } from '../AuthContext';

export default function AuthModal({ isOpen, initialMode = 'login', onClose }) {
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('organizer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { save } = useContext(AuthContext);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
      setUsername('');
      setEmail('');
      setPassword('');
      setRole('organizer');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

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
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-[#e2f0ed] overflow-hidden transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration line */}
        <div className="bg-gradient-to-r from-[#61d6cc] to-[#2cb67d] h-2 w-full" />
        
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black text-gray-800">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-semibold leading-none cursor-pointer p-1 transition hover:scale-110"
            >
              &times;
            </button>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                mode === 'login' 
                  ? 'bg-white text-gray-800 shadow-sm border border-gray-100' 
                  : 'text-gray-500 hover:text-gray-800 border border-transparent'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                mode === 'signup' 
                  ? 'bg-white text-gray-800 shadow-sm border border-gray-100' 
                  : 'text-gray-500 hover:text-gray-800 border border-transparent'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-100/50 text-rose-600 rounded-xl text-xs font-semibold flex items-center gap-2">
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
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2cb67d] text-sm bg-white"
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
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2cb67d] text-sm bg-white"
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
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2cb67d] text-sm bg-white"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">I want to register as</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2cb67d] text-sm bg-white cursor-pointer font-semibold"
                >
                  <option value="organizer">Event Organizer</option>
                  <option value="attendee">Event Attendee</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2cb67d] hover:bg-[#209c68] text-white font-bold py-3 rounded-xl shadow-lg shadow-[#2cb67d]/20 hover:shadow-[#2cb67d]/35 hover:-translate-y-[1px] active:translate-y-0 transform transition duration-150 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-400 font-medium">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button 
                  onClick={() => { setMode('signup'); setError(''); }}
                  className="text-[#2cb67d] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button 
                  onClick={() => { setMode('login'); setError(''); }}
                  className="text-[#2cb67d] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
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
