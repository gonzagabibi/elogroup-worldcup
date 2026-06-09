import { useState, useEffect } from 'react'

const FLAG_MAP: Record<string, string> = {
  'Mexico': 'mx', 'South Africa': 'za', 'South Korea': 'kr', 'Czech Republic': 'cz',
  'Canada': 'ca', 'Bosnia and Herzegovina': 'ba', 'Qatar': 'qa', 'Switzerland': 'ch',
  'Brazil': 'br', 'Morocco': 'ma', 'Haiti': 'ht', 'Scotland': 'gb-sct',
  'United States': 'us', 'Paraguay': 'py', 'Australia': 'au', 'Turkey': 'tr',
  'Germany': 'de', 'Curaçao': 'cw', 'Ivory Coast': 'ci', 'Ecuador': 'ec',
  'Netherlands': 'nl', 'Japan': 'jp', 'Sweden': 'se', 'Tunisia': 'tn',
  'Belgium': 'be', 'Egypt': 'eg', 'Iran': 'ir', 'New Zealand': 'nz',
  'Spain': 'es', 'Cape Verde': 'cv', 'Saudi Arabia': 'sa', 'Uruguay': 'uy',
  'France': 'fr', 'Senegal': 'sn', 'Iraq': 'iq', 'Norway': 'no',
  'Argentina': 'ar', 'Algeria': 'dz', 'Austria': 'at', 'Jordan': 'jo',
  'Portugal': 'pt', 'Democratic Republic of the Congo': 'cd', 'Uzbekistan': 'uz', 'Colombia': 'co',
  'England': 'gb-eng', 'Croatia': 'hr', 'Ghana': 'gh', 'Panama': 'pa',
}

type Game = {
  id: string
  home_team_name_en: string
  away_team_name_en: string
  home_score: string
  away_score: string
  finished: string
  time_elapsed: string
  local_date: string
  group: string
  type: string
  home_team_label?: string
  away_team_label?: string
}

function Flag({ name }: { name: string }) {
  const code = FLAG_MAP[name]
  if (!code) return <span className="text-xs text-gray-400">{name.slice(0,3)}</span>
  return <span className={`fi fi-${code} rounded-sm`} style={{ fontSize: '1.4rem', lineHeight: 1 }}></span>
}

function parseDate(localDate: string): Date {
  const [datePart, timePart] = localDate.split(' ')
  const [month, day, year] = datePart.split('/')
  return new Date(`${year}-${month}-${day}T${timePart}:00`)
}

function formatDate(localDate: string): string {
  const d = parseDate(localDate)
  return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
}

function formatTime(localDate: string): string {
  const d = parseDate(localDate)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function GameCard({ game }: { game: Game }) {
  const isLive = game.finished === 'FALSE' && game.time_elapsed !== 'notstarted'
  const isFinished = game.finished === 'TRUE'
  const isUpcoming = game.time_elapsed === 'notstarted' && game.finished === 'FALSE'
  const homeName = game.home_team_name_en || game.home_team_label || '?'
  const awayName = game.away_team_name_en || game.away_team_label || '?'

  return (
    <div className={`bg-white rounded-xl border p-4 ${isLive ? 'border-green-400 shadow-md' : 'border-gray-200'}`}>
      {isLive && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-bold text-green-600 tracking-wider">
            {game.time_elapsed !== 'notstarted' ? `${game.time_elapsed}'` : 'AO VIVO'}
          </span>
        </div>
      )}
      {isFinished && (
        <div className="text-xs text-gray-400 font-bold mb-2 tracking-wider">ENCERRADO</div>
      )}
      {isUpcoming && (
        <div className="text-xs text-gray-400 mb-2">
          {formatDate(game.local_date)} · {formatTime(game.local_date)} (horário local)
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          {game.home_team_name_en && <Flag name={game.home_team_name_en} />}
          <span className="text-sm font-semibold truncate">{homeName}</span>
        </div>
        {(isLive || isFinished) ? (
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-xl font-black ${isLive ? 'text-green-600' : 'text-black'}`}>{game.home_score}</span>
            <span className="text-gray-300 text-sm">×</span>
            <span className={`text-xl font-black ${isLive ? 'text-green-600' : 'text-black'}`}>{game.away_score}</span>
          </div>
        ) : (
          <div className="text-sm font-bold text-gray-300 flex-shrink-0">VS</div>
        )}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="text-sm font-semibold truncate text-right">{awayName}</span>
          {game.away_team_name_en && <Flag name={game.away_team_name_en} />}
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-400 text-center">
        {game.type === 'group' ? `GRUPO ${game.group}` : game.group}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [tab, setTab] = useState<'live' | 'today' | 'upcoming' | 'results'>('today')

  const fetchGames = async () => {
    try {
      const res = await fetch('/api/games')
      const data = await res.json()
      setGames(data.games || [])
      setLastUpdated(new Date())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGames()
    const interval = setInterval(fetchGames, 60000) // atualiza a cada 1 min
    return () => clearInterval(interval)
  }, [])

  const now = new Date()
  const todayStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const liveGames = games.filter(g => g.finished === 'FALSE' && g.time_elapsed !== 'notstarted')
  const todayGames = games.filter(g => {
    const d = parseDate(g.local_date)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) === todayStr
  })
  const upcomingGames = games.filter(g => g.time_elapsed === 'notstarted' && g.finished === 'FALSE' && parseDate(g.local_date) > now).slice(0, 10)
  const finishedGames = games.filter(g => g.finished === 'TRUE').reverse().slice(0, 20)

  const tabs = [
    { id: 'live', label: `AO VIVO${liveGames.length ? ` (${liveGames.length})` : ''}` },
    { id: 'today', label: 'HOJE' },
    { id: 'upcoming', label: 'PRÓXIMOS' },
    { id: 'results', label: 'RESULTADOS' },
  ]

  const currentGames =
    tab === 'live' ? liveGames :
    tab === 'today' ? todayGames :
    tab === 'upcoming' ? upcomingGames :
    finishedGames

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-400 text-sm">Carregando jogos...</p>
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-black text-3xl tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>DASHBOARD</h1>
          <p className="text-gray-400 text-sm">Copa do Mundo 2026 — jogos em tempo real</p>
        </div>
        <div className="text-right">
          {lastUpdated && (
            <p className="text-xs text-gray-400">Atualizado {lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
          )}
          <button onClick={fetchGames} className="text-xs text-green-600 font-bold hover:underline">↻ Atualizar</button>
        </div>
      </div>

      {liveGames.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-green-700 text-sm font-bold">{liveGames.length} jogo{liveGames.length > 1 ? 's' : ''} ao vivo agora!</span>
        </div>
      )}

      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
            className={`px-4 py-3 text-xs font-semibold tracking-widest border-b-2 whitespace-nowrap transition ${
              tab === t.id ? 'border-yellow-400 text-black' : 'border-transparent text-gray-400 hover:text-black'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {currentGames.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">⚽</div>
          <p className="text-sm">
            {tab === 'live' ? 'Nenhum jogo ao vivo no momento' :
             tab === 'today' ? 'Nenhum jogo hoje' :
             tab === 'upcoming' ? 'Nenhum jogo agendado' :
             'Nenhum resultado ainda'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentGames.map(game => <GameCard key={game.id} game={game} />)}
        </div>
      )}
    </div>
  )
}
