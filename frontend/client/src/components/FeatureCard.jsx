import React from 'react'

export default function FeatureCard({ color, label, icon, onClick, isActive }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-center rounded-2xl h-36 flex flex-col items-center justify-center gap-2 shadow-md hover:shadow-xl hover:scale-[1.03] active:scale-[0.97] transform transition duration-150 cursor-pointer border-4 outline-none ${
        isActive ? 'border-white/50 ring-4 ring-[#61d6cc]/55' : 'border-transparent'
      }`}
      style={{ backgroundColor: color }}
    >
      <div className="bg-white/25 w-12 h-12 rounded-full flex items-center justify-center">
        <span className="text-xl">{icon}</span>
      </div>
      <div className="text-white text-base font-bold tracking-wide">{label}</div>
    </button>
  )
}
