import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Bolao from './pages/Bolao'
import Ranking from './pages/Ranking'
import Pontuacao from './pages/Pontuacao'
import MinhaPerformance from './pages/MinhaPerformance'
import BolãoCraques from './pages/BolãoCraques'
import PerfilUsuario from './pages/PerfilUsuario'
import Layout from './components/Layout'

type Page = 'dashboard' | 'bolao' | 'ranking' | 'pontuacao' | 'performance' | 'craques' | 'perfil'

function AppContent() {
  const { user, loading } = useAuth()
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [perfilUserId, setPerfilUserId] = useState<string | null>(null)

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">⚽</div>
        <p className="text-gray-400 text-sm tracking-widest">CARREGANDO...</p>
      </div>
    </div>
  )

  if (!user) return <Login />

  const navigateToPerfil = (userId: string) => {
    setPerfilUserId(userId)
    setCurrentPage('perfil')
  }

  return (
    <Layout currentPage={currentPage} onNavigate={(page) => setCurrentPage(page as Page)}>
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'bolao' && <Bolao />}
      {currentPage === 'ranking' && <Ranking onViewPerfil={navigateToPerfil} />}
      {currentPage === 'pontuacao' && <Pontuacao />}
      {currentPage === 'performance' && <MinhaPerformance />}
      {currentPage === 'craques' && <BolãoCraques />}
      {currentPage === 'perfil' && perfilUserId && (
        <PerfilUsuario
          userId={perfilUserId}
          onBack={() => setCurrentPage('ranking')}
        />
      )}
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