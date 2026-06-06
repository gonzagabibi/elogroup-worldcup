import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Bolao from './pages/Bolao'
import Ranking from './pages/Ranking'
import Pontuacao from './pages/Pontuacao'
import Layout from './components/Layout'

function AppContent() {
  const { user, loading } = useAuth()
  const [currentPage, setCurrentPage] = useState('dashboard')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚽</div>
          <p className="text-gray-400 text-sm tracking-widest">CARREGANDO...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Login />

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'bolao' && <Bolao />}
      {currentPage === 'ranking' && <Ranking />}
      {currentPage === 'pontuacao' && <Pontuacao />}
    </Layout>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}