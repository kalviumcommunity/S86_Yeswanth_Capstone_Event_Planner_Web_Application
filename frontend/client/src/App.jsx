import React, { useState } from 'react'
import { AuthProvider } from './AuthContext'
import Landing from './components/Landing'
import Home from './components/Home'
import AuthPage from './components/AuthPage'
import './App.css'

function AppContent() {
  const [screen, setScreen] = useState('landing')
  const [initialTab, setInitialTab] = useState('dashboard')

  return (
    <>
      {screen === 'landing' && (
        <Landing 
          onEnter={(tab = 'dashboard') => {
            setInitialTab(tab);
            setScreen('home');
          }} 
          onAuth={(mode) => {
            localStorage.setItem('auth_initial_mode', mode);
            setScreen('auth');
          }}
        />
      )}
      {screen === 'auth' && (
        <AuthPage 
          onBack={() => setScreen('landing')} 
          onSuccess={() => setScreen('home')} 
          onEnterGuest={(tab = 'dashboard') => {
            setInitialTab(tab);
            setScreen('home');
          }}
        />
      )}
      {screen === 'home' && (
        <Home 
          initialTab={initialTab}
          onAuthRedirect={(mode) => {
            localStorage.setItem('auth_initial_mode', mode);
            setScreen('auth');
          }}
          onGoBack={() => setScreen('landing')}
        />
      )}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
