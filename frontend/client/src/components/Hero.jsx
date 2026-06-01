import React from 'react'

export default function Hero() {
  // High-fidelity background images representing a premium luxury wedding reception
  const bgImage = "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=80"; // Beautiful wedding arch
  
  return (
    <section className="w-full rounded-[28px] overflow-hidden relative border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-slate-900">
      {/* Decorative ambient glow circles inside the banner */}
      <div className="absolute top-[-20%] left-[-10%] w-72 h-72 rounded-full bg-teal-400/20 blur-3xl pointer-events-none z-10" />
      <div className="absolute bottom-[-20%] right-[-10%] w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none z-10" />

      {/* Main Image Backdrop with Gradient and Tint overlay */}
      <div 
        className="h-64 md:h-76 lg:h-80 bg-cover bg-center relative transition-transform duration-700 hover:scale-105" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.65)), url('${bgImage}')` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1b19]/80 via-transparent to-transparent pointer-events-none" />

        {/* Content Container */}
        <div className="h-full w-full flex flex-col items-center justify-center text-white text-center px-6 relative z-20">
          
          {/* Tagline Badge */}
          <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-teal-500/80 backdrop-blur-md px-3.5 py-1 rounded-full border border-teal-400/30 shadow-sm mb-3">
            ✨ Upcoming Featured Event
          </span>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-md">
            Marriage Ceremony
          </h2>
          <p className="text-[11px] md:text-xs text-teal-100/90 font-extrabold tracking-wider mt-1.5 uppercase flex items-center justify-center gap-1.5">
            <span>Grand Ballroom</span> • <span>June 18, 2026</span>
          </p>

          {/* Glassmorphic Countdown Numbers */}
          <div className="mt-6 flex gap-3 md:gap-5 justify-center items-center">
            {[
              { label: 'Days', val: '62' },
              { label: 'Hrs', val: '14' },
              { label: 'Mins', val: '12' },
              { label: 'Secs', val: '40' },
            ].map((unit, index) => (
              <div 
                key={index} 
                className="backdrop-blur-xl bg-white/12 border border-white/25 rounded-2xl py-3 px-4 w-16 sm:w-20 flex flex-col items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-white/18"
              >
                <span className="text-xl md:text-2xl font-black text-white leading-none">
                  {unit.val}
                </span>
                <span className="text-[9px] md:text-[10px] font-bold text-teal-200/90 uppercase tracking-widest mt-1">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

