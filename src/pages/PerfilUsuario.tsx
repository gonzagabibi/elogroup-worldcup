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

const CRAQUES = ['Neymar','Vinicius Jr','Endrick','Messi','Mbappé','CR7','Haaland','Bellingham','Lamine Yamal','Modric','Salah']

function Flag({ code, size = 'md' }: { code: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: '1rem', md: '1.4rem', lg: '2rem' }
  return <span className={`fi fi-${code} rounded-sm`} style={{ fontSize: sizes[size], lineHeight: 1, flexShrink: 0 }} />
}

export default function PerfilUsuario({ userId, onBack }: { userId: string; onBack: () => void }) {
  const { user } = useAuth()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('grupos')
  const [activeGroup, setActiveGroup] = useState('A')
  const isMe = userId === user?.id

  useEffect(() => { load() }, [userId])

  const load = async () => {
    const { data: pred } = await supabase
      .from('predictions')
      .select('data, confirmed')
      .eq('user_id', userId)
      .single()
    setData(pred)
    setLoading(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>
  )

  if (!data) return (
    <div className="text-center py-20">
      <p className="text-gray-400">Este usuário ainda não preencheu o bolão.</p>
      <button onClick={onBack} className="mt-4 text-green-600 text-sm font-bold">← Voltar</button>
    </div>
  )

  const bolao = data.data || {}
  const scores = bolao.scores || {}
  const bw = bolao.bracketWinners || {}
  const bracket = bolao.bracket || {}
  const bracketScores = bolao.bracketScores || {}
  const penaltyWinners = bolao.penaltyWinners || {}
  const champion = (bw['final'] || []).find(Boolean)
  const nome = bolao.nome || 'Participante'

  const tabs = [
    { id: 'grupos', label: 'GRUPOS' },
    { id: 'r32', label: 'R32' },
    { id: 'oitavas', label: 'OITAVAS' },
    { id: 'quartas', label: 'QUARTAS' },
    { id: 'semi', label: 'SEMI' },
    { id: 'final', label: 'FINAL' },
    { id: 'craques', label: 'CRAQUES' },
  ]

  const renderBracketStage = (st: string) => {
    const pairs = bracket[st] || []
    if (pairs.length === 0) return (
      <div className="text-center py-10 text-gray-400 text-sm">Esta fase não foi preenchida.</div>
    )
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {pairs.map((pair: any, i: number) => {
          const ta = pair?.[0], tb = pair?.[1]
          if (!ta || !tb) return (
            <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4 opacity-40">
              <span className="text-xs text-gray-400">⏳ A definir</span>
            </div>
          )
          const s = bracketScores[st] || {}
          const w = bw[st]?.[i]
          const penW = penaltyWinners[st]?.[i]
          const sa = s[`${i}-a`] ?? '-'
          const sb = s[`${i}-b`] ?? '-'
          const isTie = sa !== '-' && sb !== '-' && sa === sb
          return (
            <div key={i} className={`bg-white border rounded-xl p-4 flex items-center gap-3 ${isTie ? 'border-yellow-300' : 'border-gray-200'}`}>
              <span className={`flex items-center gap-2 flex-1 text-sm font-medium ${w?.n === ta.n ? 'text-green-600 font-bold' : ''}`}>
                <Flag code={ta.c} />{ta.n}
                {w?.n === ta.n && <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-bold">✓</span>}
                {penW?.n === ta.n && <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold">PEN</span>}
              </span>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="w-10 h-8 flex items-center justify-center border border-gray-200 rounded text-sm font-bold bg-gray-50">{sa}</span>
                <span className="text-gray-300 text-xs">×</span>
                <span className="w-10 h-8 flex items-center justify-center border border-gray-200 rounded text-sm font-bold bg-gray-50">{sb}</span>
              </div>
              <span className={`flex items-center gap-2 flex-1 justify-end text-sm font-medium ${w?.n === tb.n ? 'text-green-600 font-bold' : ''}`}>
                {w?.n === tb.n && <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-bold">✓</span>}
                {penW?.n === tb.n && <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold">PEN</span>}
                {tb.n}<Flag code={tb.c} />
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <button onClick={onBack} className="text-gray-400 text-sm mb-3 flex items-center gap-1 hover:text-black transition">
          ← Voltar ao Ranking
        </button>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-yellow-400 font-black text-xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            {nome.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              {isMe ? 'MEU BOLÃO' : nome.toUpperCase()}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              {data.confirmed
                ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">✓ Confirmado</span>
                : <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold">Em andamento</span>}
              {champion && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  🏆 <Flag code={champion.c} size="sm" /> {champion.n}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {champion && (
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 mb-6 flex items-center gap-4">
          <div className="text-3xl">🏆</div>
          <div>
            <p className="text-xs font-bold text-yellow-700 tracking-widest">CAMPEÃO APOSTADO</p>
            <div className="flex items-center gap-2 mt-1">
              <Flag code={champion.c} />
              <span className="font-black text-lg" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{champion.n}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-xs font-semibold tracking-widest border-b-2 whitespace-nowrap transition ${
              activeTab === tab.id ? 'border-yellow-400 text-black' : 'border-transparent text-gray-400 hover:text-black'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* GRUPOS */}
      {activeTab === 'grupos' && (
        <div>
          <div className="flex border-b border-gray-100 mb-4 overflow-x-auto">
            {GROUPS.map(g => (
              <button key={g.name} onClick={() => setActiveGroup(g.name)}
                className={`px-3 py-2 text-xs font-semibold tracking-widest border-b-2 whitespace-nowrap transition ${
                  activeGroup === g.name ? 'border-yellow-400 text-black' : 'border-transparent text-gray-400 hover:text-black'
                }`}>
                {g.name}
              </button>
            ))}
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-black px-4 py-2">
              <span className="text-yellow-400 font-black tracking-widest text-sm" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                GRUPO {activeGroup}
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {MATCHES.map(([ai, bi]) => {
                const g = GROUPS.find(g => g.name === activeGroup)!
                const key = `${ai}-${bi}`
                const s = scores[GROUPS.findIndex(g => g.name === activeGroup)] || {}
                const userA = s[`${key}-a`] ?? '-'
                const userB = s[`${key}-b`] ?? '-'
                return (
                  <div key={key} className="flex items-center gap-3 px-4 py-3">
                    <span className="flex items-center gap-2 flex-1 text-sm font-medium">
                      <Flag code={g.teams[ai].c} />{g.teams[ai].n}
                    </span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="w-10 h-8 flex items-center justify-center border border-gray-200 rounded text-sm font-bold bg-gray-50">{userA}</span>
                      <span className="text-gray-300 text-xs">×</span>
                      <span className="w-10 h-8 flex items-center justify-center border border-gray-200 rounded text-sm font-bold bg-gray-50">{userB}</span>
                    </div>
                    <span className="flex items-center gap-2 flex-1 justify-end text-sm font-medium">
                      {g.teams[bi].n}<Flag code={g.teams[bi].c} />
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* MATA-MATA */}
      {['r32','oitavas','quartas','semi','final'].includes(activeTab) && renderBracketStage(activeTab)}

      {/* CRAQUES */}
      {activeTab === 'craques' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-black px-4 py-2">
            <span className="text-yellow-400 font-black tracking-widest text-sm" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>GOLS APOSTADOS</span>
          </div>
          {bolao.craques && Object.keys(bolao.craques).length > 0 ? (
            <div className="divide-y divide-gray-100">
              {CRAQUES.map(nome => (
                <div key={nome} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm font-medium">{nome}</span>
                  <span className="font-black text-green-600" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    {bolao.craques[nome] ?? '-'} {parseInt(bolao.craques[nome]) === 1 ? 'gol' : 'gols'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-400 text-sm">Bolão dos craques não preenchido.</div>
          )}
        </div>
      )}
    </div>
  )
}