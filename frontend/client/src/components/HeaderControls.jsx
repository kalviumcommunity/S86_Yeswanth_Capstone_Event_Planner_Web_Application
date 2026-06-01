import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';

export default function HeaderControls({ onAuthRedirect }) {
  const { user, logout } = useContext(AuthContext);

  if (user) {
    return (
      <div className="flex items-center gap-4 text-white">
        <span className="font-semibold text-sm bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
          👤 {user.username}
        </span>
        <button
          onClick={logout}
          className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-4 py-1.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transform transition duration-200 text-sm cursor-pointer"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onAuthRedirect('login')}
        className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-1.5 rounded-xl border border-white/15 transition text-sm cursor-pointer"
      >
        Login
      </button>
      <button
        onClick={() => onAuthRedirect('signup')}
        className="bg-white hover:bg-gray-50 text-teal-700 font-bold px-4 py-1.5 rounded-xl transition text-sm cursor-pointer shadow-sm"
      >
        Sign Up
      </button>
    </div>
  );
}
