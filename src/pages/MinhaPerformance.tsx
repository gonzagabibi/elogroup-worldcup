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

const STAGE_LABELS: Record<string, string> = {
  r32: 'RODADA DE 32', oitavas: 'OITAVAS', quartas: 'QUARTAS', semi: 'SEMIFINAL', final: 'FINAL'
}


function Flag({ code, size = 'md' }: { code: string; size?: 'sm' | 'md' }) {
  const sizes = { sm: '1rem', md: '1.4rem' }
  return <span className={`fi fi-${code} rounded-sm`} style={{ fontSize: sizes[size], lineHeight: 1, flexShrink: 0 }} />
}

type MatchRow = {
  homeTeam: { n: string; c: string }
  awayTeam: { n: string; c: string }
  userA: number | null
  userB: number | null
  realA: number | null
  realB: number | null
  userWinner?: { n: string; c: string } | null
  realWinner?: { n: string; c: string } | null
  played: boolean
  result: 'exact' | 'winner' | 'miss' | 'pending'
  points: number
  stage: string
}

export default function MinhaPerformance() {
  const { user } = useAuth()
  const [groupRows, setGroupRows] = useState<Record<string, MatchRow[]>>({})
  const [bracketRows, setBracketRows] = useState<Record<string, MatchRow[]>>({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('A')

  useEffect(() => { load() }, [])

  const load = async () => {
    const [{ data: pred }, gamesRes] = await Promise.all([
      supabase.from('predictions').select('data').eq('user_id', user!.id).single(),
      fetch('/api/games').then(r => r.json()).catch(() => ({ games: [] })),
    ])

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

    if (!pred?.data) { setLoading(false); return }

    const data = pred.data
    const scores = data.scores || {}
    const bracket = data.bracket || {}
    const bracketScores = data.bracketScores || {}
    const bracketWinners = data.bracketWinners || {}
    const penaltyWinners = data.penaltyWinners || {}

    // Grupos
    const gRows: Record<string, MatchRow[]> = {}
    for (let gi = 0; gi < GROUPS.length; gi++) {
      const g = GROUPS[gi]
      const s = scores[gi] || {}
      gRows[g.name] = []
      for (const [ai, bi] of MATCHES) {
        const key = `${ai}-${bi}`
        const userA = s[`${key}-a`] !== undefined && s[`${key}-a`] !== '' ? parseInt(s[`${key}-a`]) : null
        const userB = s[`${key}-b`] !== undefined && s[`${key}-b`] !== '' ? parseInt(s[`${key}-b`]) : null
        const result = (results || []).find((r: any) => r.id === `group-${g.name}-${ai}-${bi}`)
        const realA = result?.played ? result.score_home : null
        const realB = result?.played ? result.score_away : null
        let matchResult: MatchRow['result'] = 'pending'
        let points = 0
        if (userA !== null && userB !== null && realA !== null && realB !== null) {
          if (userA === realA && userB === realB) { matchResult = 'exact'; points = 5 }
          else {
            const userW = userA > userB ? 'h' : userA < userB ? 'a' : 'd'
            const realW = realA > realB ? 'h' : realA < realB ? 'a' : 'd'
            if (userW === realW) { matchResult = 'winner'; points = 2 }
            else matchResult = 'miss'
          }
        }
        gRows[g.name].push({ homeTeam: g.teams[ai], awayTeam: g.teams[bi], userA, userB, realA, realB, played: result?.played || false, result: matchResult, points, stage: 'grupos' })
      }
    }
    setGroupRows(gRows)

    // Mata-mata
    const bRows: Record<string, MatchRow[]> = {}
    for (const st of ['r32', 'oitavas', 'quartas', 'semi', 'final']) {
      const pairs = bracket[st] || []
      const bs = bracketScores[st] || {}
      const bw = bracketWinners[st] || []
      const pw = penaltyWinners[st] || []
      bRows[st] = pairs.map((pair: any, i: number) => {
        if (!pair || !pair[0] || !pair[1]) return null
        const ta = pair[0], tb = pair[1]
        const userA = bs[`${i}-a`] !== undefined && bs[`${i}-a`] !== '' ? parseInt(bs[`${i}-a`]) : null
        const userB = bs[`${i}-b`] !== undefined && bs[`${i}-b`] !== '' ? parseInt(bs[`${i}-b`]) : null
        // Deriva vencedor do placar editado; só usa bw/pw se não há placar
        let userWinner = null
        if (userA !== null && userB !== null) {
          if (userA > userB) userWinner = ta
          else if (userB > userA) userWinner = tb
          else userWinner = pw[i] || null  // empate: usa penaltyWinner
        } else {
          userWinner = pw[i] || bw[i] || null
        }
        // Resultado real do mata-mata ainda não disponível
        return {
          homeTeam: ta, awayTeam: tb,
          userA, userB, realA: null, realB: null,
          userWinner, realWinner: null,
          played: false, result: 'pending' as const, points: 0, stage: st
        }
      }).filter(Boolean) as MatchRow[]
    }
    setBracketRows(bRows)
    setLoading(false)
  }

  const allRows = [...Object.values(groupRows).flat(), ...Object.values(bracketRows).flat()]
  const totalPoints = allRows.reduce((acc, r) => acc + r.points, 0)
  const exactHits = allRows.filter(r => r.result === 'exact').length
  const winnerHits = allRows.filter(r => r.result === 'winner').length
  const misses = allRows.filter(r => r.result === 'miss').length

  const groupTabs = GROUPS.map(g => ({ id: g.name, label: g.name, pts: (groupRows[g.name] || []).reduce((a, r) => a + r.points, 0) }))
  const stageTabs = ['r32', 'oitavas', 'quartas', 'semi', 'final'].map(st => ({
    id: st, label: st === 'r32' ? 'R32' : st === 'oitavas' ? 'OIT' : st === 'quartas' ? 'QUA' : st === 'semi' ? 'SEMI' : 'FINAL',
    pts: (bracketRows[st] || []).reduce((a, r) => a + r.points, 0)
  }))

  const isGroupTab = GROUPS.some(g => g.name === activeTab)
  const currentRows = isGroupTab ? (groupRows[activeTab] || []) : (bracketRows[activeTab] || [])

  const renderRow = (row: MatchRow, i: number) => (
    <div key={i} className={`px-4 py-4 ${
      row.result === 'exact' ? 'bg-green-50' :
      row.result === 'winner' ? 'bg-blue-50' :
      row.result === 'miss' ? 'bg-red-50' : ''
    }`}>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 flex-1 text-sm font-medium">
          <Flag code={row.homeTeam.c} />{row.homeTeam.n}
        </span>
        <div className="flex flex-col items-center gap-1">
          {row.userA !== null && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400 mr-1">Palpite:</span>
              <span className={`w-8 h-7 flex items-center justify-center rounded text-sm font-bold border ${
                row.result === 'exact' ? 'border-green-400 bg-green-100 text-green-700' :
                row.result === 'winner' ? 'border-blue-300 bg-blue-50 text-blue-700' :
                row.result === 'miss' ? 'border-red-300 bg-red-50 text-red-600' :
                'border-gray-200 text-gray-500'
              }`}>{row.userA}</span>
              <span className="text-gray-300 text-xs">×</span>
              <span className={`w-8 h-7 flex items-center justify-center rounded text-sm font-bold border ${
                row.result === 'exact' ? 'border-green-400 bg-green-100 text-green-700' :
                row.result === 'winner' ? 'border-blue-300 bg-blue-50 text-blue-700' :
                row.result === 'miss' ? 'border-red-300 bg-red-50 text-red-600' :
                'border-gray-200 text-gray-500'
              }`}>{row.userB}</span>
            </div>
          )}
          {row.userA === null && row.userWinner && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400 mr-1">Aposta:</span>
              <span className="flex items-center gap-1 text-xs font-bold text-gray-600 border border-gray-200 px-2 py-1 rounded">
                <Flag code={row.userWinner.c} size="sm" />{row.userWinner.n}
              </span>
            </div>
          )}
          {row.userA !== null && row.userWinner && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-gray-400 mr-1">Vencedor:</span>
              <span className="flex items-center gap-1 text-xs font-bold text-yellow-700 border border-yellow-300 bg-yellow-50 px-2 py-0.5 rounded">
                <Flag code={row.userWinner.c} size="sm" />{row.userWinner.n} 🥅
              </span>
            </div>
          )}
          {row.played && row.realA !== null && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400 mr-1">Real: &nbsp;&nbsp;</span>
              <span className="w-8 h-7 flex items-center justify-center rounded text-sm font-bold bg-gray-100 text-gray-700">{row.realA}</span>
              <span className="text-gray-300 text-xs">×</span>
              <span className="w-8 h-7 flex items-center justify-center rounded text-sm font-bold bg-gray-100 text-gray-700">{row.realB}</span>
            </div>
          )}
          {!row.played && !isGroupTab && (
            <span className="text-xs text-gray-300">Jogo ainda não aconteceu</span>
          )}
        </div>
        <span className="flex items-center gap-2 flex-1 justify-end text-sm font-medium">
          {row.awayTeam.n}<Flag code={row.awayTeam.c} />
        </span>
        <div className="w-16 text-right flex-shrink-0">
          {row.result === 'exact' && <span className="text-xs font-bold text-green-600">🎯 +{row.points}pts</span>}
          {row.result === 'winner' && <span className="text-xs font-bold text-blue-600">✓ +{row.points}pts</span>}
          {row.result === 'miss' && <span className="text-xs font-bold text-red-500">✗ 0pts</span>}
          {row.result === 'pending' && <span className="text-xs text-gray-300">⏳</span>}
        </div>
      </div>
    </div>
  )

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-black text-3xl tracking-widest mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>MINHA PERFORMANCE</h1>
        <p className="text-gray-400 text-sm">Seus acertos jogo a jogo</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'PONTOS', value: totalPoints, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'PLACARES EXATOS', value: exactHits, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'VENCEDOR CERTO', value: winnerHits, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'ERROS', value: misses, color: 'text-red-500', bg: 'bg-red-50' },
        ].map(card => (
          <div key={card.label} className={`${card.bg} rounded-xl p-4 text-center`}>
            <p className={`font-black text-3xl ${card.color}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{card.value}</p>
            <p className="text-xs text-gray-500 font-bold tracking-widest mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs grupos */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        <div className="flex">
          {groupTabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2.5 text-xs font-semibold tracking-widest border-b-2 whitespace-nowrap transition flex flex-col items-center ${
                activeTab === tab.id ? 'border-yellow-400 text-black' : 'border-transparent text-gray-400 hover:text-black'
              }`}>
              {tab.label}
              {tab.pts > 0 && <span className="text-green-600 font-black text-xs">{tab.pts}pts</span>}
            </button>
          ))}
        </div>
        <div className="w-px bg-gray-200 mx-1 self-stretch"></div>
        <div className="flex">
          {stageTabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2.5 text-xs font-semibold tracking-widest border-b-2 whitespace-nowrap transition flex flex-col items-center ${
                activeTab === tab.id ? 'border-yellow-400 text-black' : 'border-transparent text-gray-400 hover:text-black'
              }`}>
              {tab.label}
              {tab.pts > 0 && <span className="text-green-600 font-black text-xs">{tab.pts}pts</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-4">
        <div className="bg-black px-4 py-2">
          <span className="text-yellow-400 font-black tracking-widest text-sm" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            {isGroupTab ? `GRUPO ${activeTab}` : STAGE_LABELS[activeTab]}
          </span>
        </div>
        <div className="divide-y divide-gray-100">
          {currentRows.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">Nenhum jogo nesta fase ainda.</div>
          ) : (
            currentRows.map((row, i) => renderRow(row, i))
          )}
        </div>
      </div>
    </div>
  )
}