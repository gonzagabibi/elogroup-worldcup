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

function Flag({ code, size = 'md' }: { code: string; size?: 'sm' | 'md' }) {
  const sizes = { sm: '1rem', md: '1.4rem' }
  return <span className={`fi fi-${code} rounded-sm`} style={{ fontSize: sizes[size], lineHeight: 1, flexShrink: 0 }} />
}

type MatchResult = { id: string; score_home: number; score_away: number; played: boolean }
type MatchRow = {
  groupName: string
  homeTeam: { n: string; c: string }
  awayTeam: { n: string; c: string }
  userA: number | null
  userB: number | null
  realA: number | null
  realB: number | null
  played: boolean
  result: 'exact' | 'winner' | 'miss' | 'pending'
  points: number
}

export default function MinhaPerformance() {
  const { user } = useAuth()
  const [rows, setRows] = useState<MatchRow[]>([])
  const [loading, setLoading] = useState(true)
  const [activeGroup, setActiveGroup] = useState('A')

  useEffect(() => { load() }, [])

  const load = async () => {
    const [{ data: pred }, { data: results }] = await Promise.all([
      supabase.from('predictions').select('data').eq('user_id', user!.id).single(),
      supabase.from('match_results').select('*'),
    ])

    if (!pred?.data) { setLoading(false); return }

    const data = pred.data
    const scores = data.scores || {}
    const allRows: MatchRow[] = []

    for (let gi = 0; gi < GROUPS.length; gi++) {
      const g = GROUPS[gi]
      const s = scores[gi] || {}
      for (const [ai, bi] of MATCHES) {
        const key = `${ai}-${bi}`
        const userA = s[`${key}-a`] !== undefined && s[`${key}-a`] !== '' ? parseInt(s[`${key}-a`]) : null
        const userB = s[`${key}-b`] !== undefined && s[`${key}-b`] !== '' ? parseInt(s[`${key}-b`]) : null

        const result = (results || []).find((r: MatchResult) => r.id === `group-${g.name}-${ai}-${bi}`)
        const realA = result?.played ? result.score_home : null
        const realB = result?.played ? result.score_away : null

        let matchResult: MatchRow['result'] = 'pending'
        let points = 0

        if (userA !== null && userB !== null && realA !== null && realB !== null) {
          if (userA === realA && userB === realB) {
            matchResult = 'exact'; points = 5
          } else {
            const userW = userA > userB ? 'h' : userA < userB ? 'a' : 'd'
            const realW = realA > realB ? 'h' : realA < realB ? 'a' : 'd'
            if (userW === realW) { matchResult = 'winner'; points = 2 }
            else matchResult = 'miss'
          }
        }

        allRows.push({
          groupName: g.name,
          homeTeam: g.teams[ai],
          awayTeam: g.teams[bi],
          userA, userB, realA, realB,
          played: result?.played || false,
          result: matchResult,
          points,
        })
      }
    }

    setRows(allRows)
    setLoading(false)
  }

  const groupRows = rows.filter(r => r.groupName === activeGroup)
  const totalPoints = rows.reduce((acc, r) => acc + r.points, 0)
  const exactHits = rows.filter(r => r.result === 'exact').length
  const winnerHits = rows.filter(r => r.result === 'winner').length
  const misses = rows.filter(r => r.result === 'miss').length
  const played = rows.filter(r => r.played).length

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

      {/* Cards de resumo */}
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

      {played === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-center">
          <p className="text-yellow-700 text-sm font-medium">⏳ Nenhum jogo aconteceu ainda. Os resultados aparecerão aqui conforme a Copa avança!</p>
        </div>
      )}

      {/* Tabs de grupo */}
      <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
        {GROUPS.map(g => {
          const gRows = rows.filter(r => r.groupName === g.name)
          const gPts = gRows.reduce((acc, r) => acc + r.points, 0)
          return (
            <button key={g.name} onClick={() => setActiveGroup(g.name)}
              className={`px-3 py-2.5 text-xs font-semibold tracking-widest border-b-2 whitespace-nowrap transition flex flex-col items-center ${
                activeGroup === g.name ? 'border-yellow-400 text-black' : 'border-transparent text-gray-400 hover:text-black'
              }`}>
              {g.name}
              {gPts > 0 && <span className="text-green-600 font-black text-xs">{gPts}pts</span>}
            </button>
          )
        })}
      </div>

      {/* Jogos do grupo */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-black px-4 py-2">
          <span className="text-yellow-400 font-black tracking-widest text-sm" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            GRUPO {activeGroup}
          </span>
        </div>
        <div className="divide-y divide-gray-100">
          {groupRows.map((row, i) => (
            <div key={i} className={`px-4 py-4 ${
              row.result === 'exact' ? 'bg-green-50' :
              row.result === 'winner' ? 'bg-blue-50' :
              row.result === 'miss' ? 'bg-red-50' : ''
            }`}>
              <div className="flex items-center gap-3">
                {/* Time casa */}
                <span className="flex items-center gap-2 flex-1 text-sm font-medium">
                  <Flag code={row.homeTeam.c} />{row.homeTeam.n}
                </span>

                {/* Placares */}
                <div className="flex flex-col items-center gap-1">
                  {/* Seu palpite */}
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400 mr-1">Palpite:</span>
                    <span className={`w-8 h-7 flex items-center justify-center rounded text-sm font-bold border ${
                      row.result === 'exact' ? 'border-green-400 bg-green-100 text-green-700' :
                      row.result === 'winner' ? 'border-blue-300 bg-blue-50 text-blue-700' :
                      row.result === 'miss' ? 'border-red-300 bg-red-50 text-red-600' :
                      'border-gray-200 text-gray-500'
                    }`}>{row.userA ?? '-'}</span>
                    <span className="text-gray-300 text-xs">×</span>
                    <span className={`w-8 h-7 flex items-center justify-center rounded text-sm font-bold border ${
                      row.result === 'exact' ? 'border-green-400 bg-green-100 text-green-700' :
                      row.result === 'winner' ? 'border-blue-300 bg-blue-50 text-blue-700' :
                      row.result === 'miss' ? 'border-red-300 bg-red-50 text-red-600' :
                      'border-gray-200 text-gray-500'
                    }`}>{row.userB ?? '-'}</span>
                  </div>
                  {/* Resultado real */}
                  {row.played && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-400 mr-1">Real: &nbsp;&nbsp;</span>
                      <span className="w-8 h-7 flex items-center justify-center rounded text-sm font-bold bg-gray-100 text-gray-700">{row.realA}</span>
                      <span className="text-gray-300 text-xs">×</span>
                      <span className="w-8 h-7 flex items-center justify-center rounded text-sm font-bold bg-gray-100 text-gray-700">{row.realB}</span>
                    </div>
                  )}
                </div>

                {/* Time visitante */}
                <span className="flex items-center gap-2 flex-1 justify-end text-sm font-medium">
                  {row.awayTeam.n}<Flag code={row.awayTeam.c} />
                </span>

                {/* Resultado */}
                <div className="w-16 text-right flex-shrink-0">
                  {row.result === 'exact' && <span className="text-xs font-bold text-green-600">🎯 +{row.points}pts</span>}
                  {row.result === 'winner' && <span className="text-xs font-bold text-blue-600">✓ +{row.points}pts</span>}
                  {row.result === 'miss' && <span className="text-xs font-bold text-red-500">✗ 0pts</span>}
                  {row.result === 'pending' && <span className="text-xs text-gray-300">⏳</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}