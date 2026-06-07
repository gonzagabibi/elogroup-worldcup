import { useAuth } from '../context/AuthContext'
import eloLogo from '../assets/02 Logotipo sem fundo_preto.png'

interface LayoutProps {
  children: React.ReactNode
  currentPage: string
  onNavigate: (page: string) => void
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { user, signOut } = useAuth()

 const navItems = [
  { id: 'ranking', label: 'RANKING' },
  { id: 'bolao', label: 'MEU BOLÃO' },
  { id: 'craques', label: 'CRAQUES' },
  { id: 'performance', label: 'PERFORMANCE' },
  { id: 'dashboard', label: 'DASHBOARD' },
  { id: 'pontuacao', label: 'PONTUAÇÃO' },
]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-1 bg-green-600"></div>
      <div className="h-1 bg-yellow-400"></div>
      <header className="bg-black px-6 h-14 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <img src={eloLogo} alt="EloGroup" className="h-6" style={{filter:'invert(1)'}} />
          <div className="w-px h-5 bg-gray-700"></div>
          <span className="bg-green-600 text-white text-xs font-bold tracking-widest px-3 py-1 rounded-full">WORLD CUP CHALLENGE 2026</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-xs hidden sm:block">{user?.email}</span>
          <button onClick={signOut} className="text-gray-400 hover:text-white text-xs font-semibold tracking-wider transition">SAIR</button>
        </div>
      </header>
      <nav className="bg-white border-b border-gray-200 px-6 flex sticky top-14 z-40 overflow-x-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`px-5 py-4 text-xs font-semibold tracking-widest border-b-2 transition whitespace-nowrap ${
              currentPage === item.id || (currentPage === 'perfil' && item.id === 'ranking')
                ? 'border-yellow-400 text-black'
                : 'border-transparent text-gray-400 hover:text-black'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}