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
 
function FlagGame({ name }: { name: string }) {
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
  return parseDate(localDate).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
}
 
function formatTime(localDate: string): string {
  return parseDate(localDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
 
function GameCard({ game }: { game: Game }) {
  const isLive = game.finished === 'FALSE' && game.time_elapsed !== 'notstarted'
  const isFinished = game.finished === 'TRUE'
  const isUpcoming = game.time_elapsed === 'notstarted' && game.finished === 'FALSE'
  const homeName = game.home_team_name_en || game.home_team_label || '?'
  const awayName = game.away_team_name_en || game.away_team_label || '?'
  return (
    <div className={`bg-white rounded-xl border p-4 ${isLive ? 'border-green-400' : 'border-gray-200'}`}>
      {isLive && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-bold text-green-600 tracking-wider">
            {game.time_elapsed !== 'notstarted' ? `${game.time_elapsed}'` : 'AO VIVO'}
          </span>
        </div>
      )}
      {isFinished && <div className="text-xs text-gray-400 font-bold mb-2 tracking-wider">ENCERRADO</div>}
      {isUpcoming && (
        <div className="text-xs text-gray-400 mb-2">{formatDate(game.local_date)} · {formatTime(game.local_date)}</div>
      )}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <FlagGame name={game.home_team_name_en} />
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
          <FlagGame name={game.away_team_name_en} />
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-400 text-center">
        {game.type === 'group' ? `GRUPO ${game.group}` : game.group}
      </div>
    </div>
  )
}
 
function AoVivoGames() {
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
    const interval = setInterval(fetchGames, 60000)
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
    <div className="flex items-center justify-center py-10">
      <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
 
  return (
    <div>
      {liveGames.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-green-700 text-sm font-bold">{liveGames.length} jogo{liveGames.length > 1 ? 's' : ''} ao vivo agora!</span>
        </div>
      )}
      <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
            className={`px-4 py-2.5 text-xs font-semibold tracking-widest border-b-2 whitespace-nowrap transition ${
              tab === t.id ? 'border-yellow-400 text-black' : 'border-transparent text-gray-400 hover:text-black'
            }`}>{t.label}</button>
        ))}
        <div className="ml-auto flex items-center pr-1">
          {lastUpdated && <span className="text-xs text-gray-300 mr-2">{lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>}
          <button onClick={fetchGames} className="text-xs text-green-600 font-bold hover:underline">↻</button>
        </div>
      </div>
      {currentGames.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">⚽</div>
          <p className="text-sm">{tab === 'live' ? 'Nenhum jogo ao vivo no momento' : tab === 'today' ? 'Nenhum jogo hoje' : tab === 'upcoming' ? 'Nenhum jogo agendado' : 'Nenhum resultado ainda'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentGames.map(game => <GameCard key={game.id} game={game} />)}
        </div>
      )}
    </div>
  )
}
 
const GROUPS = [
  { name: 'A', teams: [{n:'México',c:'mx'},{n:'África do Sul',c:'za'},{n:'Coreia do Sul',c:'kr'},{n:'Rep. Tcheca',c:'cz'}] },
  { name: 'B', teams: [{n:'Canadá',c:'ca'},{n:'Bósnia-Herz.',c:'ba'},{n:'Catar',c:'qa'},{n:'Suíça',c:'ch'}] },
  { name: 'C', teams: [{n:'Brasil',c:'br'},{n:'Marrocos',c:'ma'},{n:'Haiti',c:'ht'},{n:'Escócia',c:'gb-sct'}] },
  { name: 'D', teams: [{n:'EUA',c:'us'},{n:'Paraguai',c:'py'},{n:'Austrália',c:'au'},{n:'Turquia',c:'tr'}] },
  { name: 'E', teams: [{n:'Alemanha',c:'de'},{n:'Curaçao',c:'cw'},{n:'Costa do Marfim',c:'ci'},{n:'Equador',c:'ec'}] },
  { name: 'F', teams: [{n:'Países Baixos',c:'nl'},{n:'Japão',c:'jp'},{n:'Suécia',c:'se'},{n:'Tunísia',c:'tn'}] },
  { name: 'G', teams: [{n:'Bélgica',c:'be'},{n:'Egito',c:'eg'},{n:'Irã',c:'ir'},{n:'Nova Zelândia',c:'nz'}] },
  { name: 'H', teams: [{n:'Espanha',c:'es'},{n:'Cabo Verde',c:'cv'},{n:'Arábia Saudita',c:'sa'},{n:'Uruguai',c:'uy'}] },
  { name: 'I', teams: [{n:'França',c:'fr'},{n:'Senegal',c:'sn'},{n:'Iraque',c:'iq'},{n:'Noruega',c:'no'}] },
  { name: 'J', teams: [{n:'Argentina',c:'ar'},{n:'Argélia',c:'dz'},{n:'Áustria',c:'at'},{n:'Jordânia',c:'jo'}] },
  { name: 'K', teams: [{n:'Portugal',c:'pt'},{n:'Congo (RD)',c:'cd'},{n:'Uzbequistão',c:'uz'},{n:'Colômbia',c:'co'}] },
  { name: 'L', teams: [{n:'Inglaterra',c:'gb-eng'},{n:'Croácia',c:'hr'},{n:'Gana',c:'gh'},{n:'Panamá',c:'pa'}] },
]
 
type Team = { n: string; c: string }
type Standing = { team: Team; pts: number; saldo: number; gf: number; groupName: string }
 
const THIRD_SLOTS = [
  { winner: 0,  eligible: ['C','E','F','H','I'] },
  { winner: 1,  eligible: ['E','F','G','I','J'] },
  { winner: 3,  eligible: ['B','E','F','I','J'] },
  { winner: 4,  eligible: ['A','B','C','D','F'] },
  { winner: 6,  eligible: ['A','E','H','I','J'] },
  { winner: 8,  eligible: ['C','D','F','G','H'] },
  { winner: 10, eligible: ['D','E','I','J','L'] },
  { winner: 11, eligible: ['E','H','I','J','K'] },
]
 
function buildR32(cls: Record<number, Team[]>, thirds: Standing[]): (Team | null)[][] {
  const sorted = [...thirds].sort((a, b) =>
    b.pts !== a.pts ? b.pts - a.pts : b.saldo !== a.saldo ? b.saldo - a.saldo : b.gf - a.gf
  )
  const best8 = sorted.slice(0, 8)
  const used = new Set<string>()
  const t: Record<number, Team | null> = {}
  for (const slot of THIRD_SLOTS) {
    const eligible = best8.filter(x => slot.eligible.includes(x.groupName) && !used.has(x.groupName))
      .sort((a, b) => b.pts !== a.pts ? b.pts - a.pts : b.saldo !== a.saldo ? b.saldo - a.saldo : b.gf - a.gf)
    if (eligible.length > 0) { t[slot.winner] = eligible[0].team; used.add(eligible[0].groupName) }
    else { const fb = best8.find(x => !used.has(x.groupName)); t[slot.winner] = fb?.team || null; if (fb) used.add(fb.groupName) }
  }
  const c = cls
  return [
    [c[0]?.[1], c[1]?.[1]], [c[4]?.[0], t[4]], [c[5]?.[0], c[2]?.[1]], [c[2]?.[0], c[5]?.[1]],
    [c[8]?.[0], t[8]], [c[4]?.[1], c[8]?.[1]], [c[0]?.[0], t[0]], [c[11]?.[0], t[11]],
    [c[3]?.[0], t[3]], [c[6]?.[0], t[6]], [c[10]?.[1], c[11]?.[1]], [c[7]?.[0], c[9]?.[1]],
    [c[1]?.[0], t[1]], [c[9]?.[0], c[7]?.[1]], [c[10]?.[0], t[10]], [c[3]?.[1], c[6]?.[1]],
  ]
}
 
function Flag({ code, size = 'sm' }: { code: string; size?: 'sm' | 'md' }) {
  const sizes = { sm: '0.85rem', md: '1.1rem' }
  return <span className={`fi fi-${code} rounded-sm`} style={{ fontSize: sizes[size], lineHeight: 1, flexShrink: 0 }} />
}
 
const TH = 576
const CW = 18
const LH = 20
 
function TeamSlot({ team, winner, onClick }: { team: Team | null; winner: Team | null; onClick?: () => void }) {
  if (!team) return (
    <div className="flex items-center gap-1.5 px-1.5 py-1 rounded opacity-30 h-7">
      <div className="w-5 h-5 rounded-full border border-dashed border-gray-300 flex-shrink-0" />
      <span className="text-xs text-gray-300">—</span>
    </div>
  )
  const isW = winner?.n === team.n
  const isL = winner && winner.n !== team.n
  return (
    <button onClick={onClick} disabled={!onClick}
      className={`flex items-center gap-1.5 px-1.5 py-1 rounded h-7 text-left transition-all
        ${isW ? 'bg-green-50' : isL ? 'opacity-30' : onClick ? 'hover:bg-gray-50' : ''}
        ${onClick ? 'cursor-pointer' : 'cursor-default'}`}>
      <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0
        ${isW ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
        <Flag code={team.c} size="sm" />
      </div>
      <span className={`text-xs max-w-14 truncate ${isL ? 'text-gray-300' : 'text-gray-700'}`}>{team.n}</span>
    </button>
  )
}
 
function BracketCol({ pairs, winners, label, onPick }: {
  pairs: (Team | null)[][], winners: (Team | null)[], label: string,
  onPick: (mi: number, team: Team) => void
}) {
  const n = pairs.length
  const cellH = TH / n
  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{ height: LH, fontSize: 9, fontWeight: 500, color: '#888', letterSpacing: '.07em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{label}</div>
      <div style={{ height: TH }}>
        {pairs.map((pair, i) => {
          const ta = pair?.[0], tb = pair?.[1], w = winners[i]
          return (
            <div key={i} style={{ height: cellH, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2, padding: '0 4px' }}>
              <TeamSlot team={ta} winner={w} onClick={ta && tb ? () => onPick(i, ta) : undefined} />
              <TeamSlot team={tb} winner={w} onClick={ta && tb ? () => onPick(i, tb) : undefined} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
 
function Connector({ count, side }: { count: number; side: 'L' | 'R' }) {
  const cellH = TH / count
  const paths: string[] = []
  for (let i = 0; i < count; i += 2) {
    const y1 = cellH * i + cellH / 2
    const y2 = cellH * (i + 1) + cellH / 2
    const ym = (y1 + y2) / 2
    if (side === 'L') paths.push(`M0,${y1} H${CW/2} V${ym} M0,${y2} H${CW/2} V${ym} M${CW/2},${ym} H${CW}`)
    else paths.push(`M${CW},${y1} H${CW/2} V${ym} M${CW},${y2} H${CW/2} V${ym} M${CW/2},${ym} H0`)
  }
  return (
    <div style={{ flexShrink: 0, width: CW }}>
      <div style={{ height: LH }} />
      <svg width={CW} height={TH} style={{ display: 'block' }}>
        {paths.map((d, i) => <path key={i} d={d} fill="none" stroke="#D3D1C7" strokeWidth="1.5" />)}
      </svg>
    </div>
  )
}
 
function ConnectorSemi({ side }: { side: 'L' | 'R' }) {
  const y = TH / 2
  const d = side === 'L' ? `M0,${y} H${CW}` : `M${CW},${y} H0`
  return (
    <div style={{ flexShrink: 0, width: CW }}>
      <div style={{ height: LH }} />
      <svg width={CW} height={TH} style={{ display: 'block' }}>
        <path d={d} fill="none" stroke="#D3D1C7" strokeWidth="1.5" />
      </svg>
    </div>
  )
}
 
export default function Chaveamento() {
  const [activeTab, setActiveTab] = useState<'simulacao' | 'aovivo'>('simulacao')
  const [simStep, setSimStep] = useState<'grupos' | 'bracket'>('grupos')
  const [classified, setClassified] = useState<Record<number, (Team | null)[]>>(
    Object.fromEntries(GROUPS.map((_, i) => [i, [null, null, null]]))
  )
 
  const emptyPairs = (n: number) => Array(n).fill(null).map(() => [null, null] as (Team | null)[])
  const [r32, setR32] = useState<(Team | null)[][]>(emptyPairs(8))
  const [oitL, setOitL] = useState<(Team | null)[][]>(emptyPairs(4))
  const [oitR, setOitR] = useState<(Team | null)[][]>(emptyPairs(4))
  const [qtL, setQtL] = useState<(Team | null)[][]>(emptyPairs(2))
  const [qtR, setQtR] = useState<(Team | null)[][]>(emptyPairs(2))
  const [semiL, setSemiL] = useState<(Team | null)[][]>(emptyPairs(1))
  const [semiR, setSemiR] = useState<(Team | null)[][]>(emptyPairs(1))
  const [finalPair, setFinalPair] = useState<(Team | null)[]>([null, null])
  const [champion, setChampion] = useState<Team | null>(null)
  const [winnersL, setWinnersL] = useState<Record<string, (Team | null)[]>>({ r32: Array(8).fill(null), oit: Array(4).fill(null), qt: Array(2).fill(null), semi: [null] })
  const [winnersR, setWinnersR] = useState<Record<string, (Team | null)[]>>({ r32: Array(8).fill(null), oit: Array(4).fill(null), qt: Array(2).fill(null), semi: [null] })
 
  const selectClassified = (gi: number, ti: number) => {
    const team = GROUPS[gi].teams[ti]
    const sel = [...(classified[gi] || [null, null, null])]
    const pos = sel.findIndex(t => t?.n === team.n)
    if (pos >= 0) { sel.splice(pos, 1); sel.push(null) }
    else { const empty = sel.indexOf(null); if (empty >= 0) sel[empty] = team }
    setClassified(prev => ({ ...prev, [gi]: sel }))
  }
 
  const allGroupsDone = GROUPS.every((_, gi) => classified[gi]?.[1] !== null)
  const groupsDone = GROUPS.filter((_, gi) => classified[gi]?.[1] !== null).length
 
  const startBracket = () => {
    const cls: Record<number, Team[]> = {}
    const thirds: Standing[] = []
    GROUPS.forEach((_, gi) => {
      const sel = classified[gi] || []
      cls[gi] = [sel[0], sel[1]].filter(Boolean) as Team[]
      if (sel[2]) thirds.push({ team: sel[2], pts: 0, saldo: 0, gf: 0, groupName: GROUPS[gi].name })
    })
    const pairs = buildR32(cls, thirds)
    setR32(pairs.map(p => [p[0] || null, p[1] || null]))
    setOitL(emptyPairs(4)); setOitR(emptyPairs(4))
    setQtL(emptyPairs(2)); setQtR(emptyPairs(2))
    setSemiL(emptyPairs(1)); setSemiR(emptyPairs(1))
    setFinalPair([null, null]); setChampion(null)
    setWinnersL({ r32: Array(8).fill(null), oit: Array(4).fill(null), qt: Array(2).fill(null), semi: [null] })
    setWinnersR({ r32: Array(8).fill(null), oit: Array(4).fill(null), qt: Array(2).fill(null), semi: [null] })
    setSimStep('bracket')
  }
 
  const pickSide = (side: 'L' | 'R', stage: string, mi: number, team: Team) => {
    const getW = side === 'L' ? winnersL : winnersR
    const setW = side === 'L' ? setWinnersL : setWinnersR
    const newW = { ...getW, [stage]: [...(getW[stage] || [])] }
    newW[stage][mi] = team
    setW(newW)
    const next: Record<string, string> = { r32: 'oit', oit: 'qt', qt: 'semi' }
    const nextStage = next[stage]
    const pi = Math.floor(mi / 2)
    const partner = newW[stage][mi % 2 === 0 ? mi + 1 : mi - 1]
    if (!nextStage) {
      setFinalPair(prev => { const n = [...prev]; n[side === 'L' ? 0 : 1] = team; return n })
      setChampion(null); return
    }
    if (partner) {
      const newPair: (Team | null)[] = mi % 2 === 0 ? [team, partner] : [partner, team]
      if (side === 'L') {
        if (nextStage === 'oit') setOitL(prev => { const n = [...prev]; n[pi] = newPair; return n })
        else if (nextStage === 'qt') setQtL(prev => { const n = [...prev]; n[pi] = newPair; return n })
        else if (nextStage === 'semi') setSemiL([[newPair[0], newPair[1]]])
      } else {
        if (nextStage === 'oit') setOitR(prev => { const n = [...prev]; n[pi] = newPair; return n })
        else if (nextStage === 'qt') setQtR(prev => { const n = [...prev]; n[pi] = newPair; return n })
        else if (nextStage === 'semi') setSemiR([[newPair[0], newPair[1]]])
      }
      newW[nextStage] = [...(newW[nextStage] || [])]; newW[nextStage][pi] = null; setW(newW)
    }
    setFinalPair(prev => { const n = [...prev]; n[side === 'L' ? 0 : 1] = null; return n })
    setChampion(null)
  }
 
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-black text-3xl tracking-widest mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>CHAVEAMENTO</h1>
        <p className="text-gray-400 text-sm">Copa do Mundo 2026 — USA · CAN · MEX · 11 Jun a 19 Jul</p>
      </div>
 
      <div className="flex border-b border-gray-200 mb-6">
        {[{ id: 'simulacao', label: '⚽ SIMULAÇÃO' }, { id: 'aovivo', label: '🔴 AO VIVO' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 text-xs font-semibold tracking-widest border-b-2 transition ${activeTab === tab.id ? 'border-yellow-400 text-black' : 'border-transparent text-gray-400 hover:text-black'}`}>
            {tab.label}
          </button>
        ))}
      </div>
 
      {activeTab === 'aovivo' && <AoVivoGames />}
 
      {activeTab === 'simulacao' && (
        <div>
          <p className="text-gray-400 text-sm mb-6">Simule a Copa do Mundo 2026 escolhendo os classificados de cada grupo e avançando fase a fase até o campeão.</p>
          <div className="flex gap-2 mb-6">
            <button onClick={() => setSimStep('grupos')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${simStep==='grupos'?'bg-black text-yellow-400':'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              1. GRUPOS
            </button>
            <button onClick={() => allGroupsDone && setSimStep('bracket')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${simStep==='bracket'?'bg-black text-yellow-400':allGroupsDone?'bg-gray-100 text-gray-500 hover:bg-gray-200':'bg-gray-100 text-gray-300 cursor-not-allowed'}`}>
              2. MATA-MATA
            </button>
          </div>
 
          {simStep === 'grupos' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {GROUPS.map((g, gi) => {
                  const sel = classified[gi] || [null,null,null]
                  const done = sel[1] !== null
                  return (
                    <div key={g.name} className={`bg-white border rounded-xl overflow-hidden ${done?'border-green-200':'border-gray-200'}`}>
                      <div className={`px-4 py-2 flex items-center justify-between ${done?'bg-green-600':'bg-black'}`}>
                        <span className="font-black text-yellow-400 tracking-widest text-sm" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>GRUPO {g.name}</span>
                        {done && <span className="text-white text-xs font-bold">✓</span>}
                      </div>
                      <div className="p-2">
                        {g.teams.map((t, ti) => {
                          const pos = sel.findIndex(s => s?.n === t.n)
                          const colors = ['bg-green-50 border-green-300','bg-blue-50 border-blue-200','bg-gray-50 border-gray-200']
                          const badges = ['bg-green-600 text-white','bg-blue-500 text-white','bg-gray-400 text-white']
                          const labels = ['1°','2°','3°']
                          return (
                            <button key={t.n} onClick={() => selectClassified(gi, ti)}
                              className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg mb-1 border transition text-left ${pos>=0?colors[pos]:'border-transparent hover:bg-gray-50'}`}>
                              <div className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center flex-shrink-0">
                                <Flag code={t.c} size="md" />
                              </div>
                              <span className="text-xs font-medium flex-1 truncate">{t.n}</span>
                              {pos >= 0 && <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${badges[pos]}`}>{labels[pos]}</span>}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500">GRUPOS COMPLETOS</span>
                  <span className="text-xs font-bold text-green-600">{groupsDone}/12</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full transition-all" style={{ width: `${(groupsDone/12)*100}%` }} />
                </div>
              </div>
              {allGroupsDone && (
                <button onClick={startBracket}
                  className="w-full bg-black text-yellow-400 font-black tracking-widest py-3 rounded-xl text-sm hover:bg-gray-900 transition"
                  style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  VER MATA-MATA →
                </button>
              )}
            </div>
          )}
 
          {simStep === 'bracket' && (
            <div>
              <p className="text-xs text-gray-400 mb-4">Clique no time vencedor de cada confronto para avançar de fase.</p>
              <div style={{ overflowX: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', minWidth: 900 }}>
                  <BracketCol pairs={r32.slice(0,8)} winners={winnersL.r32.slice(0,8)} label="Rodada de 32" onPick={(mi,t)=>pickSide('L','r32',mi,t)} />
                  <Connector count={8} side="L" />
                  <BracketCol pairs={oitL} winners={winnersL.oit} label="Oitavas" onPick={(mi,t)=>pickSide('L','oit',mi,t)} />
                  <Connector count={4} side="L" />
                  <BracketCol pairs={qtL} winners={winnersL.qt} label="Quartas" onPick={(mi,t)=>pickSide('L','qt',mi,t)} />
                  <Connector count={2} side="L" />
                  <BracketCol pairs={semiL} winners={winnersL.semi} label="Semi" onPick={(mi,t)=>pickSide('L','semi',mi,t)} />
                  <ConnectorSemi side="L" />
 
                  <div style={{ flexShrink: 0, width: 100 }}>
                    <div style={{ height: LH, fontSize: 9, fontWeight: 600, color: '#CA8A04', letterSpacing: '.07em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Final</div>
                    <div style={{ height: TH, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <TeamSlot team={finalPair[0]} winner={champion} onClick={finalPair[0]&&finalPair[1]?()=>setChampion(finalPair[0]):undefined} />
                      <span style={{ fontSize: 10, color: '#ccc' }}>×</span>
                      <TeamSlot team={finalPair[1]} winner={champion} onClick={finalPair[0]&&finalPair[1]?()=>setChampion(finalPair[1]??null):undefined} />
                      {champion && (
                        <div className="text-center mt-3">
                          <div style={{ fontSize: 22 }}>🏆</div>
                          <div style={{ fontSize: 9, color: '#888', textTransform: 'uppercase', letterSpacing: '.07em', margin: '2px 0' }}>Campeão</div>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <div className="w-6 h-6 rounded-full border-2 border-yellow-400 bg-yellow-50 flex items-center justify-center">
                              <Flag code={champion.c} size="sm" />
                            </div>
                            <span className="font-black text-sm" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{champion.n}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
 
                  <ConnectorSemi side="R" />
                  <BracketCol pairs={semiR} winners={winnersR.semi} label="Semi" onPick={(mi,t)=>pickSide('R','semi',mi,t)} />
                  <Connector count={2} side="R" />
                  <BracketCol pairs={qtR} winners={winnersR.qt} label="Quartas" onPick={(mi,t)=>pickSide('R','qt',mi,t)} />
                  <Connector count={4} side="R" />
                  <BracketCol pairs={oitR} winners={winnersR.oit} label="Oitavas" onPick={(mi,t)=>pickSide('R','oit',mi,t)} />
                  <Connector count={8} side="R" />
                  <BracketCol pairs={r32.slice(8,16)} winners={winnersR.r32.slice(0,8)} label="Rodada de 32" onPick={(mi,t)=>pickSide('R','r32',mi,t)} />
                </div>
              </div>
              <button onClick={() => setSimStep('grupos')} className="mt-6 text-xs text-gray-400 hover:text-black transition">
                ← Voltar aos grupos
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
