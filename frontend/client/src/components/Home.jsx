import React, { useState, useEffect, useContext } from 'react'
import Hero from './Hero'
import FeatureCard from './FeatureCard'
import EventList from './EventList'
import HeaderControls from './HeaderControls'
import api from '../api'
import { AuthContext } from '../AuthContext'

const Calendar = React.lazy(() => import('./Calendar'));
const TaskList = React.lazy(() => import('./TaskList'));
const GuestManager = React.lazy(() => import('./GuestManager'));
const BudgetPlanner = React.lazy(() => import('./BudgetPlanner'));
const VendorList = React.lazy(() => import('./VendorList'));

export default function Home({ onAuthRedirect, onGoBack, initialTab = 'dashboard' }) {
  const { user } = useContext(AuthContext)
  const [events, setEvents] = useState([])
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  const isOrganizer = !user || user.role !== 'attendee'

  const loadEvents = async () => {
    try {
      const res = await api.get('/api/events')
      setEvents(res.data)
    } catch (err) {
      console.error('Failed to load events', err)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  return (
    <div className="min-h-screen bg-transparent">
      <header className="px-6 py-4 bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <button 
            className="p-2 hover:bg-white/10 rounded-full transition duration-150 cursor-pointer" 
            onClick={() => activeTab === 'dashboard' ? onGoBack() : setActiveTab('dashboard')}
            title={activeTab === 'dashboard' ? 'Back to Portal' : 'Back to Dashboard'}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold tracking-wide cursor-pointer" onClick={() => setActiveTab('dashboard')}>Event Planner & Organizer</h1>
        </div>
        <HeaderControls onAuthRedirect={onAuthRedirect} />
      </header>

      <main className="p-6 w-full max-w-full">
        <Hero />

        <div className={`mt-6 grid gap-4 ${isOrganizer ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2'}`}>
          <FeatureCard 
            color="#7c5cff" 
            label="Task List" 
            icon="📋" 
            onClick={() => setActiveTab(activeTab === 'tasks' ? 'dashboard' : 'tasks')}
            isActive={activeTab === 'tasks'}
          />
          <FeatureCard 
            color="#ff4d7e" 
            label="Guests" 
            icon="🧑‍🤝‍🧑" 
            onClick={() => setActiveTab(activeTab === 'guests' ? 'dashboard' : 'guests')}
            isActive={activeTab === 'guests'}
          />
          {isOrganizer && (
            <FeatureCard 
              color="#61d6cc" 
              label="Budget" 
              icon="💰" 
              onClick={() => setActiveTab(activeTab === 'budget' ? 'dashboard' : 'budget')}
              isActive={activeTab === 'budget'}
            />
          )}
          {isOrganizer && (
            <FeatureCard 
              color="#f7b500" 
              label="Vendors" 
              icon="🏬" 
              onClick={() => setActiveTab(activeTab === 'vendors' ? 'dashboard' : 'vendors')}
              isActive={activeTab === 'vendors'}
            />
          )}
        </div>

        {activeTab !== 'dashboard' && (
          <div className="mt-6 flex justify-start">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="px-4 py-2 bg-white text-gray-700 hover:text-gray-900 border rounded-xl shadow-sm hover:shadow text-sm font-semibold transition cursor-pointer"
            >
              ← Back to Dashboard
            </button>
          </div>
        )}

        <div className="mt-8">
          <React.Suspense fallback={
            <div className="flex items-center justify-center p-12 text-teal-600 font-bold text-sm animate-pulse">
              <span>⏳ Loading component...</span>
            </div>
          }>
            {activeTab === 'dashboard' && (
              <div className="bg-white rounded-2xl shadow-md p-6 border border-teal-50/50">
                <EventList events={events} onEventChange={loadEvents} />
              </div>
            )}
            {activeTab === 'tasks' && <TaskList events={events} />}
            {activeTab === 'guests' && <GuestManager events={events} />}
            {activeTab === 'budget' && <BudgetPlanner events={events} />}
            {activeTab === 'vendors' && <VendorList events={events} />}
          </React.Suspense>
        </div>
      </main>
    </div>
  )
}
