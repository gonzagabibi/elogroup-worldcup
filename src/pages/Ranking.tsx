import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
 
const GROUPS = [
  { name:'A', teams:[{n:'México',c:'mx'},{n:'África do Sul',c:'za'},{n:'Coreia do Sul',c:'kr'},{n:'Rep. Tcheca',c:'cz'}] },
  { name:'B', teams:[{n:'Canadá',c:'ca'},{n:'Bósnia-Herz.',c:'ba'},{n:'Catar',c:'qa'},{n:'Suíça',c:'ch'}] },
  { name:'C', teams:[{n:'Brasil',c:'br'},{n:'Marrocos',c:'ma'},{n:'Haiti',c:'ht'},{n:'Escócia',c:'gb-sct'}] },
  { name:'D', teams:[{n:'EUA',c:'us'},{n:'Paraguai',c:'py'},{n:'Austrália',c:'au'},{n:'Turquia',c:'tr'}] },
  { name:'E', teams:[{n:'Alemanha',c:'de'},{n:'Curaçao',c:'cw'},{n:'Costa do Marfim',c:'ci'},{n:'Equador',c:'ec'}] },
  { name:'F', teams:[{n:'Países Baixos',c:'nl'},{n:'Japão',c:'jp'},{n:'Suécia',c:'se'},{n:'Tunísia',c:'tn'}] },
  { name:'G', teams:[{n:'Bélgica',c:'be'},{n:'Egito',c:'eg'},{n:'Irã',c:'ir'},{n:'Nova Zelândia',c:'nz'}] },
  { name:'H', teams:[{n:'Espanha',c:'es'},{n:'Cabo Verde',c:'cv'},{n:'Arábia Saudita',c:'sa'},{n:'Uruguai',c:'uy'}] },
  { name:'I', teams:[{n:'França',c:'fr'},{n:'Senegal',c:'sn'},{n:'Iraque',c:'iq'},{n:'Noruega',c:'no'}] },
  { name:'J', teams:[{n:'Argentina',c:'ar'},{n:'Argélia',c:'dz'},{n:'Áustria',c:'at'},{n:'Jordânia',c:'jo'}] },
  { name:'K', teams:[{n:'Portugal',c:'pt'},{n:'Congo (RD)',c:'cd'},{n:'Uzbequistão',c:'uz'},{n:'Colômbia',c:'co'}] },
  { name:'L', teams:[{n:'Inglaterra',c:'gb-eng'},{n:'Croácia',c:'hr'},{n:'Gana',c:'gh'},{n:'Panamá',c:'pa'}] },
]
const MATCHES = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]
 
const FIFA_RANKINGS: Record<string, number> = {
  'França': 1, 'Espanha': 2, 'Argentina': 3, 'Inglaterra': 4, 'Portugal': 5,
  'Brasil': 6, 'Países Baixos': 7, 'Marrocos': 8, 'Bélgica': 9, 'Alemanha': 10,
  'Croácia': 11, 'Colômbia': 13, 'Senegal': 14, 'México': 15, 'EUA': 16,
  'Uruguai': 17, 'Japão': 20, 'Suíça': 22, 'Coreia do Sul': 23, 'Suécia': 25,
  'Austrália': 25, 'Equador': 30, 'Turquia': 32, 'Rep. Tcheca': 35,
  'Noruega': 36, 'Escócia': 38, 'Irã': 40, 'Costa do Marfim': 42,
  'Egito': 44, 'Áustria': 46, 'Canadá': 48, 'Argélia': 50, 'Tunísia': 52,
  'Arábia Saudita': 55, 'Gana': 58, 'Paraguai': 60, 'África do Sul': 62,
  'Cabo Verde': 70, 'Bósnia-Herz.': 72, 'Jordânia': 80, 'Iraque': 82,
  'Uzbequistão': 85, 'Catar': 88, 'Congo (RD)': 92, 'Panamá': 95,
  'Nova Zelândia': 98, 'Curaçao': 105, 'Haiti': 115,
}
 
function getFifaMult(teamA: string, teamB: string): number {
  const ra = FIFA_RANKINGS[teamA] || 50
  const rb = FIFA_RANKINGS[teamB] || 50
  const diff = Math.abs(ra - rb)
  if (diff <= 15) return 2.5
  if (diff <= 40) return 1.5
  return 1.0
}
 
const CATEGORIES = [
  { label: '🦅 Olho de Águia', min: 0, max: 5, color: 'bg-yellow-400 text-black' },
  { label: '🏆 Craque do Sofá', min: 5, max: 20, color: 'bg-green-600 text-white' },
  { label: '⚽ Torcedor Raiz', min: 20, max: 50, color: 'bg-blue-500 text-white' },
  { label: '🎲 Chute no Escuro', min: 50, max: 75, color: 'bg-orange-400 text-white' },
  { label: '💀 VAR me Ajuda', min: 75, max: 101, color: 'bg-red-500 text-white' },
]
 
function getCategory(percentile: number) {
  return CATEGORIES.find(c => percentile >= c.min && percentile < c.max) || CATEGORIES[4]
}
 
function getBadges(data: any, exactHits: number): string[] {
  const badges: string[] = []
  if (!data) return badges
  const bw = data.bracketWinners || {}
  const champion = (bw['final'] || []).find(Boolean)
  if (champion?.c === 'br') badges.push('🇧🇷 Patriota')
  if (Object.keys(data.scores || {}).length === 12 && champion) badges.push('✅ Completo')
  if (exactHits >= 5) badges.push('🔮 Vidente')
  return badges
}
 
function calcPointsFromResults(data: any, results: any[]): { total: number; byStage: Record<string, number>; exactHits: number } {
  if (!data) return { total: 0, byStage: {}, exactHits: 0 }
  const scores = data.scores || {}
  let total = 0, exactHits = 0
  const byStage: Record<string, number> = { grupos: 0, r32: 0, oitavas: 0, quartas: 0, semi: 0, final: 0 }
 
  // Fase de grupos
  for (let gi = 0; gi < GROUPS.length; gi++) {
    const g = GROUPS[gi]
    const s = scores[gi] || {}
    for (const [ai, bi] of MATCHES) {
      const key = `${ai}-${bi}`
      const userA = parseInt(s[`${key}-a`] ?? '')
      const userB = parseInt(s[`${key}-b`] ?? '')
      if (isNaN(userA) || isNaN(userB)) continue
      const result = results.find((r: any) => r.id === `group-${g.name}-${ai}-${bi}`)
      if (!result?.played) continue
      const realA = result.score_home, realB = result.score_away
      const mult = getFifaMult(g.teams[ai].n, g.teams[bi].n)
      const isBrasil = g.teams[ai].n === 'Brasil' || g.teams[bi].n === 'Brasil'
      if (userA === realA && userB === realB) {
        let pts = Math.round(5 * mult)
        if (isBrasil) pts += 3
        total += pts; byStage['grupos'] += pts; exactHits++
      } else {
        const userW = userA > userB ? 'h' : userA < userB ? 'a' : 'd'
        const realW = realA > realB ? 'h' : realA < realB ? 'a' : 'd'
        if (userW === realW) {
          let pts = Math.round(2 * mult)
          if (isBrasil) pts += 1
          total += pts; byStage['grupos'] += pts
        }
      }
    }
  }
  return { total, byStage, exactHits }
}
 
type Player = {
  id: string
  nome: string
  points: number
  confirmed: boolean
  badges: string[]
  category: ReturnType<typeof getCategory>
  byStage: Record<string, number>
  champion: any
  exactHits: number
}
 
export default function Ranking({ onViewPerfil }: { onViewPerfil: (userId: string) => void }) {
  const { user } = useAuth()
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('geral')
 
  useEffect(() => { loadRanking() }, [])
 
  const loadRanking = async () => {
    const [{ data: predictions }, gamesRes] = await Promise.all([
      supabase.from('predictions').select('user_id, data, confirmed'),
      fetch('/api/games').then(r => r.json()).catch(() => ({ games: [] })),
    ])
    if (!predictions) { setLoading(false); return }
 
    const NAME_MAP: Record<string, string> = {
      'Mexico': 'México', 'South Africa': 'África do Sul', 'South Korea': 'Coreia do Sul',
      'Czech Republic': 'Rep. Tcheca', 'Canada': 'Canadá', 'Bosnia and Herzegovina': 'Bósnia-Herz.',
      'Qatar': 'Catar', 'Switzerland': 'Suíça', 'Brazil': 'Brasil', 'Morocco': 'Marrocos',
      'Haiti': 'Haiti', 'Scotland': 'Escócia', 'United States': 'EUA', 'Paraguay': 'Paraguai',
      'Australia': 'Austrália', 'Turkey': 'Turquia', 'Germany': 'Alemanha', 'Curaçao': 'Curaçao',
      'Ivory Coast': 'Costa do Marfim', 'Ecuador': 'Equador', 'Netherlands': 'Países Baixos',
      'Japan': 'Japão', 'Sweden': 'Suécia', 'Tunisia': 'Tunísia', 'Belgium': 'Bélgica',
      'Egypt': 'Egito', 'Iran': 'Irã', 'New Zealand': 'Nova Zelândia', 'Spain': 'Espanha',
      'Cape Verde': 'Cabo Verde', 'Saudi Arabia': 'Arábia Saudita', 'Uruguay': 'Uruguai',
      'France': 'França', 'Senegal': 'Senegal', 'Iraq': 'Iraque', 'Norway': 'Noruega',
      'Argentina': 'Argentina', 'Algeria': 'Argélia', 'Austria': 'Áustria', 'Jordan': 'Jordânia',
      'Portugal': 'Portugal', 'Democratic Republic of the Congo': 'Congo (RD)',
      'Uzbekistan': 'Uzbequistão', 'Colombia': 'Colômbia', 'England': 'Inglaterra',
      'Croatia': 'Croácia', 'Ghana': 'Gana', 'Panama': 'Panamá',
    }
 
    const apiGames = gamesRes.games || []
    const results = apiGames
      .filter((g: any) => g.finished === 'TRUE' && g.type === 'group')
      .map((g: any) => {
        const homePt = NAME_MAP[g.home_team_name_en] || g.home_team_name_en
        const awayPt = NAME_MAP[g.away_team_name_en] || g.away_team_name_en
        const groupIdx = GROUPS.findIndex(gr => gr.name === g.group)
        if (groupIdx === -1) return null
        const group = GROUPS[groupIdx]
        const ai = group.teams.findIndex(t => t.n === homePt)
        const bi = group.teams.findIndex(t => t.n === awayPt)
        if (ai === -1 || bi === -1) return null
        const [a, b] = ai < bi ? [ai, bi] : [bi, ai]
        const scoreA = ai < bi ? parseInt(g.home_score) : parseInt(g.away_score)
        const scoreB = ai < bi ? parseInt(g.away_score) : parseInt(g.home_score)
        return { id: `group-${g.group}-${a}-${b}`, played: true, score_home: scoreA, score_away: scoreB }
      })
      .filter(Boolean)
 
    const ranked: Player[] = predictions.map(row => {
      const { total, byStage, exactHits } = calcPointsFromResults(row.data, results || [])
      const bw = row.data?.bracketWinners || {}
      const champion = (bw['final'] || []).find(Boolean) || null
      return {
        id: row.user_id,
        nome: row.data?.nome || 'Participante',
        points: total,
        confirmed: row.confirmed,
        badges: getBadges(row.data, exactHits),
        category: getCategory(0),
        byStage,
        champion,
        exactHits,
      }
    })
 
    ranked.sort((a, b) => b.points - a.points)
    const total = ranked.length
    const withCategory = ranked.map((p, i) => ({
      ...p,
      category: getCategory(total <= 1 ? 0 : (i / (total - 1)) * 100),
    }))
    setPlayers(withCategory)
    setLoading(false)
  }
 
  const myPosition = players.findIndex(p => p.id === user?.id) + 1
  const me = players.find(p => p.id === user?.id)
 
  const stageTabs = [
    { id: 'geral', label: 'GERAL' },
    { id: 'r32', label: 'R32' },
    { id: 'oitavas', label: 'OITAVAS' },
    { id: 'quartas', label: 'QUARTAS' },
    { id: 'semi', label: 'SEMI' },
  ]
 
  const sortedByStage = activeTab === 'geral'
    ? players
    : [...players].sort((a, b) => (b.byStage[activeTab] || 0) - (a.byStage[activeTab] || 0))
 
  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>
  )
 
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-black text-3xl tracking-widest mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>RANKING</h1>
        <p className="text-gray-400 text-sm">Classificação dos participantes do EloGroup World Cup Challenge</p>
      </div>
 
      {me && (
        <div className="bg-black text-white rounded-xl p-4 mb-6 flex items-center gap-4 cursor-pointer hover:bg-gray-900 transition"
          onClick={() => onViewPerfil(me.id)}>
          <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-black font-black text-lg" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            #{myPosition || '?'}
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-400 mb-0.5">SUA POSIÇÃO — clique para ver seu bolão</p>
            <p className="font-bold">{me.nome}</p>
            <div className="flex gap-2 mt-1 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded font-bold ${me.category.color}`}>{me.category.label}</span>
              {me.badges.map(b => <span key={b} className="text-xs bg-white/10 px-2 py-0.5 rounded">{b}</span>)}
            </div>
          </div>
          <div className="text-right">
            <p className="font-black text-2xl text-green-400" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{me.points}</p>
            <p className="text-xs text-gray-400">pontos</p>
            {me.exactHits > 0 && <p className="text-xs text-yellow-400">{me.exactHits} exatos</p>}
          </div>
        </div>
      )}
 
      <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
        {stageTabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-semibold tracking-widest border-b-2 whitespace-nowrap transition ${
              activeTab === tab.id ? 'border-yellow-400 text-black' : 'border-transparent text-gray-400 hover:text-black'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>
 
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-black px-6 py-3 flex items-center">
          <span className="text-yellow-400 font-black tracking-widest text-sm" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            {activeTab === 'geral' ? 'CLASSIFICAÇÃO GERAL' : `MELHOR NA FASE: ${activeTab.toUpperCase()}`}
          </span>
          <span className="text-gray-400 text-xs ml-auto">{players.length} participantes</span>
        </div>
 
        {players.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">⚽</p>
            <p className="text-gray-400 text-sm">Nenhum bolão confirmado ainda.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sortedByStage.map((player, i) => {
              const isMe = player.id === user?.id
              const pos = i + 1
              return (
                <div key={player.id}
                  className={`flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 transition ${isMe ? 'bg-green-50 hover:bg-green-100' : ''}`}
                  onClick={() => onViewPerfil(player.id)}>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 ${
                    pos === 1 ? 'bg-yellow-400 text-black' :
                    pos === 2 ? 'bg-gray-300 text-black' :
                    pos === 3 ? 'bg-orange-400 text-white' :
                    'bg-gray-100 text-gray-500'
                  }`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    {pos <= 3 ? ['🥇','🥈','🥉'][pos-1] : pos}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{isMe ? `${player.nome} (você)` : player.nome}</span>
                      {!player.confirmed && <span className="text-xs text-gray-300">(em andamento)</span>}
                    </div>
                    <div className="flex gap-1.5 mt-1 flex-wrap">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${player.category.color}`}>{player.category.label}</span>
                      {player.badges.map(b => <span key={b} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{b}</span>)}
                    </div>
                  </div>
                  {player.champion && (
                    <span className="text-xs text-gray-400 hidden md:flex items-center gap-1">
                      🏆 {player.champion.n}
                    </span>
                  )}
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-lg text-green-600" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                      {activeTab === 'geral' ? player.points : (player.byStage[activeTab] || 0)}
                    </p>
                    <p className="text-xs text-gray-400">pts</p>
                    {player.exactHits > 0 && <p className="text-xs text-yellow-500">{player.exactHits} exatos</p>}
                  </div>
                  <span className="text-gray-300 text-xs">→</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-400 text-center mt-4">Clique em qualquer participante para ver o bolão completo</p>
    </div>
  )
}
