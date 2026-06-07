import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const MATCHES = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]

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

function getBadges(data: any): string[] {
  const badges: string[] = []
  if (!data) return badges
  const bw = data.bracketWinners || {}
  const champion = (bw['final'] || []).find(Boolean)
  if (champion?.c === 'br') badges.push('🇧🇷 Patriota')
  const allGroupsDone = Object.keys(data.scores || {}).length === 12
  if (allGroupsDone && champion) badges.push('✅ Completo')
  return badges
}

function calcPoints(data: any): { total: number; byStage: Record<string, number> } {
  if (!data) return { total: 0, byStage: {} }
  const scores = data.scores || {}
  const bw = data.bracketWinners || {}
  let total = 0
  const byStage: Record<string, number> = {}

  let groupFilled = 0
  Object.values(scores).forEach((s: any) => {
    MATCHES.forEach(([a, b]) => {
      if (s[`${a}-${b}-a`] && s[`${a}-${b}-b`]) groupFilled++
    })
  })
  byStage['grupos'] = groupFilled
  total += groupFilled * 2

  const stages = ['r32', 'oitavas', 'quartas', 'semi', 'final']
  const stagePoints: Record<string, number> = { r32: 4, oitavas: 5, quartas: 7, semi: 10, final: 15 }
  stages.forEach(st => {
    const winners = (bw[st] || []).filter(Boolean).length
    byStage[st] = winners
    total += winners * (stagePoints[st] || 0)
  })

  return { total, byStage }
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
}

export default function Ranking() {
  const { user } = useAuth()
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('geral')

  useEffect(() => { loadRanking() }, [])

  const loadRanking = async () => {
    const { data, error } = await supabase
      .from('predictions')
      .select('user_id, data, confirmed')

    if (error || !data) { setLoading(false); return }

    const ranked: Player[] = data.map(row => {
      const { total, byStage } = calcPoints(row.data)
      const bw = row.data?.bracketWinners || {}
      const champion = (bw['final'] || []).find(Boolean) || null
      return {
        id: row.user_id,
        nome: row.data?.nome || 'Participante',
        points: total,
        confirmed: row.confirmed,
        badges: getBadges(row.data),
        category: getCategory(0),
        byStage,
        champion,
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
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-400 text-sm">Carregando ranking...</p>
      </div>
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-black text-3xl tracking-widest mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>RANKING</h1>
        <p className="text-gray-400 text-sm">Classificação dos participantes do EloGroup World Cup Challenge</p>
      </div>

      {me && (
        <div className="bg-black text-white rounded-xl p-4 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-black font-black text-lg" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            #{myPosition}
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-400 mb-0.5">SUA POSIÇÃO</p>
            <p className="font-bold">Você</p>
            <div className="flex gap-2 mt-1 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded font-bold ${me.category.color}`}>{me.category.label}</span>
              {me.badges.map(b => <span key={b} className="text-xs bg-white/10 px-2 py-0.5 rounded">{b}</span>)}
            </div>
          </div>
          <div className="text-right">
            <p className="font-black text-2xl text-green-400" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{me.points}</p>
            <p className="text-xs text-gray-400">pontos</p>
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
                <div key={player.id} className={`flex items-center gap-4 px-6 py-4 ${isMe ? 'bg-green-50' : ''}`}>
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
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-400 text-center mt-4">Ranking atualizado em tempo real conforme os bolões são confirmados</p>
    </div>
  )
}