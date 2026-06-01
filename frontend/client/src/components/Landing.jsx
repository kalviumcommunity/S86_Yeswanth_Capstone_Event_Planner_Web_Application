import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api'
import { 
  Users, 
  CheckCircle2, 
  Wallet, 
  Store, 
  Sparkles, 
  MessageSquare, 
  ArrowRight, 
  Calendar, 
  TrendingUp, 
  ChevronRight, 
  Search, 
  Plus, 
  Bell, 
  HelpCircle,
  Menu,
  X,
  Play,
  Activity,
  DollarSign
} from 'lucide-react'

// Elegant repeating floral pattern tile (SVG encoded data URI)
const floralPattern = encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'>
  <g fill='none' stroke='rgba(20,184,166,0.03)' stroke-width='1.5'>
    <path d='M30 15c15 15 30 5 45 15s15 25 30 15' />
    <path d='M15 75c20-10 30 15 50 5s25-25 40-15' />
    <circle cx='90' cy='30' r='3' fill='rgba(20,184,166,0.015)' />
    <circle cx='30' cy='90' r='3' fill='rgba(20,184,166,0.015)' />
    <path d='M10 10c5 20 20 20 25 40S20 80 5 95' />
  </g>
</svg>
`)

export default function Landing({ onEnter, onAuth }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeFeatureTab, setActiveFeatureTab] = useState(0)
  
  // Interactive Task List state for the Dashboard Showcase
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Confirm florist arrangements', completed: true, category: 'Vendors' },
    { id: 2, text: 'Finalize RSVP seating plan', completed: false, category: 'Guests' },
    { id: 3, text: 'Approve catering deposits', completed: false, category: 'Budget' },
    { id: 4, text: 'Distribute event itineraries', completed: false, category: 'General' },
  ])
  
  // Interactive AI Event Generator state for demo
  const [aiTopic, setAiTopic] = useState('Garden Wedding')
  const [isGeneratingAi, setIsGeneratingAi] = useState(false)
  const [aiResult, setAiResult] = useState({
    theme: 'Ethereal Botanical Haven',
    palette: 'Sage, Mint, Warm Gold & Ivory',
    suggestion: 'Install suspended foliage clusters over the main banquet table with low-voltage warm fairy lights to mirror a forest canopy.'
  })

  const featuresRef = useRef(null)
  const demoRef = useRef(null)

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const handleGenerateAi = async () => {
    setIsGeneratingAi(true)
    try {
      const res = await api.post('/api/ai/suggest', { topic: aiTopic });
      setAiResult({
        theme: res.data.theme,
        palette: res.data.palette,
        suggestion: res.data.suggestion
      });
    } catch (err) {
      console.error('Failed to query AI coordinator endpoint:', err);
      // Dynamic fallback logic
      const cleanTopic = aiTopic.toLowerCase();
      if (cleanTopic.includes('wedding') || cleanTopic.includes('marry')) {
        setAiResult({
          theme: 'Ethereal Botanical Haven',
          palette: 'Sage, Mint, Warm Gold & Ivory',
          suggestion: 'Install suspended foliage clusters over the main banquet table with low-voltage warm fairy lights.'
        });
      } else {
        setAiResult({
          theme: 'Chic Organic Modernist',
          palette: 'Terracotta, Sand, Ochre & Seafoam',
          suggestion: 'Utilize linen table runnings, micro-dosed pottery installations, and pampas floral pillars.'
        });
      }
    } finally {
      setIsGeneratingAi(false);
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] } }
  }

  const hoverCardVariants = {
    hover: { 
      y: -10, 
      boxShadow: '0 30px 100px rgba(20, 184, 166, 0.15)',
      borderColor: 'rgba(20, 184, 166, 0.45)',
      backgroundColor: 'rgba(255, 255, 255, 0.28)',
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  }

  return (
    <div
      className="min-h-screen w-screen flex flex-col font-sans relative selection:bg-teal-500/20 selection:text-teal-900 overflow-x-hidden text-slate-800"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(20,184,166,0.06) 0%, rgba(244,251,248,0.7) 40%, rgba(6,182,212,0.08) 100%), radial-gradient(circle at 50% 20%, rgba(255,255,255,0.9), rgba(255,255,255,0.4) 70%, transparent 100%), url("data:image/svg+xml;utf8,${floralPattern}")`,
        backgroundRepeat: 'repeat, no-repeat, repeat',
        backgroundSize: 'auto, cover, 180px'
      }}
    >
      {/* Background soft glowing blur elements / Cinematic Lighting */}
      <div className="absolute top-[5%] left-[-15%] w-[45rem] h-[45rem] rounded-full bg-teal-300/20 blur-[130px] animate-pulse-glow pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-15%] w-[50rem] h-[50rem] rounded-full bg-emerald-300/20 blur-[140px] animate-pulse-glow pointer-events-none z-0" style={{ animationDelay: '3s' }} />
      <div className="absolute bottom-[10%] left-[10%] w-[40rem] h-[40rem] rounded-full bg-cyan-300/15 blur-[120px] animate-pulse-glow pointer-events-none z-0" style={{ animationDelay: '6s' }} />

      {/* Floating Particles Decoration (Visual WOW factor) */}
      <div className="absolute top-24 left-[15%] w-3 h-3 bg-teal-400/30 rounded-full animate-float pointer-events-none hidden md:block" />
      <div className="absolute top-1/2 left-[5%] w-4 h-4 bg-emerald-400/25 rounded-full animate-float-slow pointer-events-none hidden md:block" />
      <div className="absolute top-[35%] right-[12%] w-2 h-2 bg-cyan-400/30 rounded-full animate-float-fast pointer-events-none hidden md:block" />

      {/* Floating Glass Navbar */}
      <nav className="w-[94%] max-w-7xl mx-auto mt-6 px-6 py-3.5 flex items-center justify-between border border-white/45 bg-white/20 backdrop-blur-2xl rounded-full shadow-[0_15px_40px_-10px_rgba(0,0,0,0.06)] sticky top-6 z-50 transition-all duration-300 hover:border-white/60">
        {/* Logo container */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-300">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-teal-800 to-emerald-700 bg-clip-text text-transparent">
            EventPlannerHub
          </span>
        </div>

        {/* Links: Center rounded pill menu */}
        <div className="hidden md:flex items-center gap-1.5 bg-white/30 border border-white/50 backdrop-blur-md rounded-full p-1 text-xs font-bold text-slate-600 shadow-inner">
          <button 
            onClick={() => scrollToSection(featuresRef)} 
            className="px-4 py-2 rounded-full hover:bg-white/60 hover:text-teal-800 transition duration-200"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection(demoRef)} 
            className="px-4 py-2 rounded-full hover:bg-white/60 hover:text-teal-800 transition duration-200"
          >
            Interactive Demo
          </button>
          <button 
            onClick={onEnter} 
            className="px-4 py-2 rounded-full hover:bg-white/60 hover:text-teal-800 transition duration-200"
          >
            Sandbox Portal
          </button>
        </div>

        {/* Action Buttons: Right */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => onAuth('login')}
            className="text-xs font-bold text-teal-800 hover:text-teal-950 transition cursor-pointer px-3 py-2"
          >
            Sign In
          </button>
          <button 
            onClick={() => onAuth('signup')}
            className="relative overflow-hidden bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-extrabold text-xs px-6 py-2.5 rounded-full shadow-[0_10px_25px_-5px_rgba(20,184,166,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(20,184,166,0.45)] hover:scale-105 active:scale-95 transform transition duration-300 cursor-pointer"
          >
            Get Started
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-teal-800 hover:bg-white/40 rounded-full transition"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-[3%] w-[94%] bg-white/95 backdrop-blur-2xl border border-white/60 rounded-3xl p-6 shadow-2xl z-40 md:hidden flex flex-col gap-4 text-center font-bold"
          >
            <button 
              onClick={() => { setMobileMenuOpen(false); scrollToSection(featuresRef); }}
              className="py-3 text-slate-700 hover:text-teal-600 border-b border-slate-100 transition"
            >
              Features
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); scrollToSection(demoRef); }}
              className="py-3 text-slate-700 hover:text-teal-600 border-b border-slate-100 transition"
            >
              Interactive Demo
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onEnter(); }}
              className="py-3 text-slate-700 hover:text-teal-600 border-b border-slate-100 transition"
            >
              Sandbox Portal
            </button>
            <div className="flex gap-4 items-center justify-center pt-2">
              <button 
                onClick={() => { setMobileMenuOpen(false); onAuth('login'); }}
                className="w-1/2 py-3 rounded-full text-teal-800 hover:bg-teal-50 transition text-sm"
              >
                Sign In
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); onAuth('signup'); }}
                className="w-1/2 py-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md text-sm"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-16 flex flex-col items-center text-center">
        
        {/* Absolute Orbital Floating Glass Cards for Desktop depth */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Floating Card 1: Guest Status (Left) */}
          <div 
            className="absolute left-[4%] top-[25%] hidden xl:flex items-center gap-3 bg-white/20 border border-white/45 backdrop-blur-2xl rounded-2xl p-4 shadow-[0_15px_40px_-5px_rgba(0,0,0,0.06)] rotate-[-6deg] animate-float"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black text-slate-400 uppercase">Guest List</div>
              <div className="text-xs font-black text-slate-800">182 RSVPs Received</div>
            </div>
          </div>

          {/* Floating Card 2: Budget Status (Right) */}
          <div 
            className="absolute right-[4%] top-[22%] hidden xl:flex items-center gap-3 bg-white/20 border border-white/45 backdrop-blur-2xl rounded-2xl p-4 shadow-[0_15px_40px_-5px_rgba(0,0,0,0.06)] rotate-[5deg] animate-float-slow"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black text-slate-400 uppercase">Budget Meter</div>
              <div className="text-xs font-black text-slate-800">92% Confirmed</div>
            </div>
          </div>

          {/* Floating Card 3: AI Theme suggestion float (Bottom Left) */}
          <div 
            className="absolute left-[8%] top-[55%] hidden xl:flex items-center gap-3 bg-white/20 border border-white/45 backdrop-blur-2xl rounded-2xl p-4 shadow-[0_15px_40px_-5px_rgba(0,0,0,0.06)] rotate-[8deg] animate-float-fast"
          >
            <div className="w-8 h-8 rounded-full bg-purple-500/15 flex items-center justify-center text-purple-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left text-xs font-black text-slate-700">
              AI Theme Generator Active
            </div>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 max-w-4xl relative z-10"
        >
          {/* Animated Glowing Calendar Icon Container */}
          <motion.div variants={itemVariants} className="relative group mx-auto w-24 h-24 flex items-center justify-center mb-2">
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-400 to-emerald-400 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition duration-500 animate-pulse-glow" />
            <div className="bg-white/45 backdrop-blur-2xl border border-white/60 rounded-full w-20 h-20 flex items-center justify-center shadow-lg hover:scale-110 transform transition duration-300">
              <Calendar className="w-9 h-9 text-teal-600 animate-bounce" style={{ animationDuration: '3.5s' }} />
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 border border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.02)] backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span className="text-[11px] font-black uppercase tracking-widest text-teal-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-spin-slow" /> Elite Planning Suite v2.0
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            variants={itemVariants} 
            className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.08] font-sans"
          >
            Plan Extraordinary Events <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              Effortlessly
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            variants={itemVariants}
            className="text-base md:text-xl text-slate-600/80 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Manage guests, budgets, RSVPs, vendors, and tasks in one beautifully designed intelligent platform. Built for the modern luxury planner.
          </motion.p>

          {/* Action buttons with custom styled requirements */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <button
              onClick={() => onAuth('signup')}
              className="group relative overflow-hidden bg-teal-500 hover:bg-teal-600 text-white font-extrabold text-sm rounded-full px-8 py-4 shadow-[0_15px_30px_-5px_rgba(20,184,166,0.4)] hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              {/* Shiny reflect animation */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              Start Planning Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => scrollToSection(demoRef)}
              className="bg-white/50 backdrop-blur border border-white/50 hover:bg-white text-slate-800 font-extrabold text-sm px-8 py-4 rounded-full shadow-[0_8px_20px_-6px_rgba(0,0,0,0.06)] hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              Explore Features
            </button>
          </motion.div>

          {/* Sandbox entry portal text */}
          <motion.div variants={itemVariants} className="pt-2">
            <button 
              onClick={onEnter}
              className="text-xs text-teal-700/85 hover:text-teal-900 font-extrabold hover:underline cursor-pointer transition flex items-center justify-center gap-1 mx-auto"
            >
              Or browse the planner workspace as guest <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </motion.div>

        {/* 3D Dashboard Showcase Frame */}
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-16 md:mt-24 relative"
        >
          {/* Outer glowing backdrop behind dashboard */}
          <div className="absolute -inset-2 bg-gradient-to-tr from-teal-500/10 via-emerald-400/5 to-cyan-500/10 rounded-[36px] blur-2xl opacity-60 z-0 pointer-events-none" />
          
          <div className="relative z-10 w-full bg-white/20 backdrop-blur-2xl border border-white/45 rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.08),0_1px_3px_rgba(255,255,255,0.4)] overflow-hidden">
            {/* Top Bar resembling Mac App */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/35 bg-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400/80 block" />
                <span className="w-3 h-3 rounded-full bg-yellow-400/80 block" />
                <span className="w-3 h-3 rounded-full bg-green-400/80 block" />
                <span className="text-[11px] font-bold text-slate-500/70 ml-4 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-teal-500 animate-pulse" /> workspace_live_v2.0
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-3 bg-white/30 border border-white/60 rounded-full px-4 py-1.5 text-xs text-slate-600 max-w-sm w-80 shadow-inner">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400 font-medium">Search events, guests, tasks...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/50 border border-white/60 flex items-center justify-center relative">
                  <Bell className="w-4 h-4 text-slate-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal-500" />
                </div>
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  EP
                </div>
              </div>
            </div>

            {/* Dashboard Layout Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 p-6 md:p-8 gap-6 md:gap-8 bg-white/5 text-left text-slate-800">
              
              {/* Left Bar (Mock Navigation Options) */}
              <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 border-b lg:border-b-0 lg:border-r border-white/20">
                <div className="text-[10px] font-bold tracking-widest text-slate-400/80 uppercase hidden lg:block mb-3 px-3">
                  Organizer Dashboard
                </div>
                {[
                  { name: 'Events Portal', active: true, count: 12 },
                  { name: 'Guest Lists', active: false, count: 86 },
                  { name: 'Budget Analyzer', active: false, count: null },
                  { name: 'Vendor Contracts', active: false, count: 5 },
                  { name: 'Discussion Forums', active: false, count: 24 },
                ].map((item, index) => (
                  <button
                    key={index}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl w-full text-xs font-bold transition text-left cursor-pointer whitespace-nowrap lg:whitespace-normal ${item.active ? 'bg-white/60 border border-white/70 text-teal-800 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.03)]' : 'hover:bg-white/30 text-slate-600'}`}
                  >
                    <span>{item.name}</span>
                    {item.count && (
                      <span className="text-[10px] bg-teal-500/10 text-teal-700 px-2 py-0.5 rounded-full border border-teal-500/20">
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
                
                {/* Floating Mock Event Details */}
                <div className="hidden lg:block mt-8 p-4 bg-teal-500/5 border border-teal-500/15 rounded-2xl space-y-3 relative overflow-hidden">
                  <div className="absolute top-[-20%] right-[-10%] w-24 h-24 rounded-full bg-teal-400/10 blur-xl pointer-events-none" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-teal-800 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                    Upcoming Event
                  </span>
                  <div className="font-black text-slate-800 leading-tight">Summer Gala Celebration</div>
                  <div className="text-[11px] text-slate-500 font-medium">June 18, 2026 • Grand Plaza</div>
                  <div className="w-full bg-slate-200/50 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full w-[78%] rounded-full" />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>Task Completion</span>
                    <span>78%</span>
                  </div>
                </div>
              </div>

              {/* Center Panel (Stats and Main Widgets Showcase) */}
              <div className="lg:col-span-9 space-y-8">
                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Stat 1 */}
                  <div className="bg-white/40 border border-white/50 rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex items-center justify-between hover:bg-white/60 transition group">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total RSVP'd</span>
                      <span className="text-2xl font-black text-slate-800 group-hover:text-teal-600 transition">342 Guests</span>
                      <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" /> +12% this week
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 group-hover:scale-105 transition-transform">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Stat 2 */}
                  <div className="bg-white/40 border border-white/50 rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex items-center justify-between hover:bg-white/60 transition group">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Budget Spent</span>
                      <span className="text-2xl font-black text-slate-800 group-hover:text-teal-600 transition">₹24,500</span>
                      <span className="text-[10px] text-slate-500 font-extrabold">Of ₹30,000 Total Limit</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                      <DollarSign className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Stat 3 */}
                  <div className="bg-white/40 border border-white/50 rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex items-center justify-between hover:bg-white/60 transition group">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Vendor Partners</span>
                      <span className="text-2xl font-black text-slate-800 group-hover:text-teal-600 transition">6 Confirmed</span>
                      <span className="text-[10px] text-teal-600 font-extrabold">2 Contracts Pending</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 group-hover:scale-105 transition-transform">
                      <Store className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Sub-layout: Interactive Tasks List and Budget Chart */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Interactive Checklist Widget (Left) */}
                  <div className="md:col-span-7 bg-white/40 border border-white/50 rounded-[28px] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.03)] space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/20">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-teal-600" />
                        <h3 className="font-extrabold text-sm text-slate-800">Checklist Manager</h3>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 bg-white/80 border border-white/65 px-2 py-0.5 rounded-full">
                        {tasks.filter(t => t.completed).length}/{tasks.length} Done
                      </span>
                    </div>

                    <div className="space-y-2">
                      {tasks.map(task => (
                        <div 
                          key={task.id}
                          onClick={() => toggleTask(task.id)}
                          className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer select-none transition ${task.completed ? 'bg-white/25 border-teal-500/20 opacity-65' : 'bg-white/70 border-white/80 hover:bg-white hover:border-slate-300'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${task.completed ? 'bg-teal-500 border-teal-600 text-white' : 'border-slate-300 bg-white'}`}>
                              {task.completed && <CheckCircle2 className="w-3.5 h-3.5 fill-current" />}
                            </div>
                            <span className={`text-xs font-bold text-slate-700 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                              {task.text}
                            </span>
                          </div>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${task.category === 'Vendors' ? 'bg-[#7c5cff]/10 text-[#7c5cff]' : task.category === 'Guests' ? 'bg-[#61d6cc]/10 text-teal-700' : task.category === 'Budget' ? 'bg-teal-600/10 text-teal-800' : 'bg-slate-500/10 text-slate-600'}`}>
                            {task.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Budget Allocation Chart & Calendar Widget (Right) */}
                  <div className="md:col-span-5 flex flex-col gap-6">
                    {/* Ring Chart Widget */}
                    <div className="bg-white/40 border border-white/50 rounded-[28px] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.03)] space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                          <Wallet className="w-5 h-5 text-teal-600" /> Budget Allocation
                        </h3>
                        <span className="text-[10px] text-teal-800 font-extrabold">Overview</span>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        {/* Circular ring in SVG */}
                        <div className="relative w-24 h-24 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-95" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(20,184,166,0.1)" strokeWidth="3" />
                            {/* Caterer (45%) */}
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="45 100" strokeDashoffset="0" />
                            {/* Florist (30%) */}
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#7c5cff" strokeWidth="3" strokeDasharray="30 100" strokeDashoffset="-45" />
                            {/* Venue (15%) */}
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#06b6d4" strokeWidth="3" strokeDasharray="15 100" strokeDashoffset="-75" />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Paid</span>
                            <span className="text-xs font-black text-slate-800">90%</span>
                          </div>
                        </div>
                        
                        <div className="flex-1 space-y-1.5 text-xs font-bold text-slate-600">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            <span>Catering (₹13,500)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#7c5cff]" />
                            <span>Floristry (₹9,000)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                            <span>Venue (₹2,000)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Activity Widget */}
                    <div className="bg-white/40 border border-white/50 rounded-[28px] p-5 shadow-[0_15px_40px_rgba(0,0,0,0.03)] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-600">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-800">Dynamic UI Preview</div>
                          <div className="text-[10px] text-slate-400 font-bold">100% interactive web sandbox</div>
                        </div>
                      </div>
                      <button 
                        onClick={onEnter}
                        className="p-2.5 bg-white hover:bg-teal-500 hover:text-white rounded-full transition shadow-sm border border-slate-200/50"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Cards Section */}
      <section ref={featuresRef} className="px-6 py-28 relative z-20 border-t border-white/35 bg-white/10">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <span className="text-[11px] font-black uppercase tracking-widest px-3.5 py-1.5 bg-teal-50 text-teal-800 rounded-full border border-teal-100/50 shadow-sm backdrop-blur-md">
              💎 Core Capability
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              An Immersive SaaS Workspace
            </h2>
            <p className="text-sm md:text-base text-slate-500 font-semibold leading-relaxed">
              Equipped with luxury workflow features, helping you manage event details seamlessly with complete responsive design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Guest Management',
                desc: 'Keep records of contacts, details, and dynamic assignments connected live to specific attendee tables.',
                icon: <Users className="w-6 h-6 text-teal-600" />,
                bg: 'bg-[#7c5cff]/10',
                color: 'hover:border-[#7c5cff]/40'
              },
              {
                title: 'RSVP Tracking',
                desc: 'Collect response states dynamically and inspect breakdown statistics panels with real-time feedback.',
                icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
                bg: 'bg-[#61d6cc]/10',
                color: 'hover:border-[#61d6cc]/40'
              },
              {
                title: 'Budget Analytics',
                desc: 'Establish spending limits, trace transaction items, and watch live spending dial graphics to prevent overruns.',
                icon: <Wallet className="w-6 h-6 text-[#06b6d4]" />,
                bg: 'bg-teal-500/10',
                color: 'hover:border-teal-500/40'
              },
              {
                title: 'Vendor Coordination',
                desc: 'Store payment deposits, contract files, and contact detail cards for florists, caterers, and venues.',
                icon: <Store className="w-6 h-6 text-[#f7b500]" />,
                bg: 'bg-[#f7b500]/10',
                color: 'hover:border-[#f7b500]/40'
              },
              {
                title: 'AI Event Suggestions',
                desc: 'Instantly generate styling prompts, color palettes, and decor ideas tailored to your theme using automated AI assistance.',
                icon: <Sparkles className="w-6 h-6 text-purple-600" />,
                bg: 'bg-purple-500/10',
                color: 'hover:border-purple-500/40'
              },
              {
                title: 'Real-Time Collaboration',
                desc: 'Post updates and join discussion threads directly inside event boards to align organizers and vendors immediately.',
                icon: <MessageSquare className="w-6 h-6 text-pink-600" />,
                bg: 'bg-pink-500/10',
                color: 'hover:border-pink-500/40'
              }
            ].map((feat, index) => (
              <motion.div
                key={index}
                variants={hoverCardVariants}
                whileHover="hover"
                className={`backdrop-blur-2xl bg-white/18 border border-white/30 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-8 flex flex-col justify-between transform transition-all duration-300 group cursor-default`}
              >
                <div className="space-y-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${feat.bg} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    {feat.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-teal-700 transition">
                    {feat.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 font-semibold leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
                <div className="pt-6 flex items-center gap-1.5 text-xs text-teal-800 font-black cursor-pointer group-hover:translate-x-1 transition-transform">
                  <span>Learn more</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive AI Preview & Demo Sandbox Showcase */}
      <section ref={demoRef} className="px-6 py-28 relative z-20 border-t border-white/35 bg-white/15">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-100/50 shadow-sm">
              ✨ Interactive Sandbox Demo
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Test Drive AI Event Suggestions
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-bold max-w-lg mx-auto">
              Type an event topic (e.g. "Beach Party" or "Gala Dinner") and run the AI theme coordinator simulation.
            </p>
          </div>

          <div className="backdrop-blur-2xl bg-white/20 border border-white/35 rounded-[32px] shadow-[0_30px_70px_-10px_rgba(0,0,0,0.06)] p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Input Controls (Left 5 Cols) */}
            <div className="md:col-span-5 space-y-5 text-left">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                  Event Category / Theme Concept
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="e.g. Garden Wedding, Corporate Tech..."
                    className="w-full px-4 py-3 bg-white/70 border border-white/80 rounded-2xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500/50 focus:bg-white transition"
                  />
                  <Sparkles className="absolute right-3.5 top-3.5 w-4 h-4 text-purple-500 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleGenerateAi}
                  disabled={isGeneratingAi}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isGeneratingAi ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating Suggestions...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate Instant Concept
                    </>
                  )}
                </button>

                <button
                  onClick={onEnter}
                  className="w-full bg-white hover:bg-teal-500 hover:text-white border border-slate-200 text-teal-800 font-extrabold text-xs py-3.5 rounded-2xl transition flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Access Full Sandbox
                </button>
              </div>
            </div>

            {/* Simulated AI Output Panel (Right 7 Cols) */}
            <div className="md:col-span-7 bg-[#0f172a] text-slate-300 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden border border-slate-800 text-left">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    AI Coordinator Suggestions
                  </span>
                </div>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Active Model v2
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recommended Theme</div>
                  <div className="font-extrabold text-sm text-white">{aiResult.theme}</div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Color Palette</div>
                  <div className="font-bold text-teal-400">{aiResult.palette}</div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Styling Tip</div>
                  <p className="text-slate-400 leading-relaxed font-semibold">
                    "{aiResult.suggestion}"
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="px-6 py-20 relative z-20">
        <div className="max-w-4xl mx-auto backdrop-blur-3xl bg-gradient-to-tr from-teal-900 to-slate-900 rounded-[40px] p-8 md:p-14 text-center text-white relative overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute -top-10 -left-10 w-44 h-44 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-6 max-w-2xl mx-auto relative z-10">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Ready to Orchestrate <br />Your Next Gala Event?
            </h2>
            <p className="text-xs md:text-sm text-teal-100/70 font-semibold leading-relaxed">
              Create an account now for free. No credit card required. Experience collaborative task timelines, instant messaging, and responsive budget analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <button
                onClick={() => onAuth('signup')}
                className="w-full sm:w-auto bg-teal-400 hover:bg-teal-500 text-slate-900 font-extrabold text-xs px-8 py-4 rounded-full shadow-lg hover:scale-105 active:scale-95 transform transition duration-300 cursor-pointer"
              >
                Start Planning Free
              </button>
              <button
                onClick={onEnter}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs px-8 py-4 rounded-full hover:scale-105 active:scale-95 transform transition duration-300 cursor-pointer"
              >
                Access Sandbox
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="w-full px-6 py-12 border-t border-white/25 bg-white/15 mt-auto relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500 font-semibold">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-400 flex items-center justify-center text-white">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-sm font-black text-slate-700 tracking-tight">EventPlannerHub</span>
          </div>

          <div className="flex justify-center gap-6 text-[10px] uppercase tracking-widest text-teal-800/80">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-teal-950 cursor-pointer">Back to Top</button>
            <span>•</span>
            <button onClick={() => scrollToSection(featuresRef)} className="hover:text-teal-950 cursor-pointer">Features</button>
            <span>•</span>
            <button onClick={onEnter} className="hover:text-teal-950 cursor-pointer">Sandbox</button>
          </div>

          <p>© 2026 Event Planner Hub. Designed for luxury scale.</p>
        </div>
      </footer>
    </div>
  )
}
