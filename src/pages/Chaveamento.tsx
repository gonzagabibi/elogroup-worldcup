import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

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

const MATCHES = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]

type Team = { n: string; c: string }

function Flag({ code, size = 'sm' }: { code: string; size?: 'sm' | 'md' }) {
  const sizes = { sm: '1rem', md: '1.3rem' }
  return <span className={`fi fi-${code} rounded-sm`} style={{ fontSize: sizes[size], lineHeight: 1, flexShrink: 0 }} />
}

function EmptySlot({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-gray-100 border border-dashed border-gray-300">
      <div className="w-4 h-4 rounded-sm bg-gray-200 flex-shrink-0" />
      <span className="text-xs text-gray-400 truncate">{label}</span>
    </div>
  )
}

function TeamSlot({ team, isWinner }: { team: Team | null; isWinner?: boolean }) {
  if (!team) return <EmptySlot label="A definir" />
  return (
    <div className={`flex items-center gap-2 px-2 py-1.5 rounded border ${isWinner ? 'bg-green-50 border-green-400' : 'bg-white border-gray-200'}`}>
      <Flag code={team.c} />
      <span className={`text-xs truncate ${isWinner ? 'font-bold text-green-700' : 'text-gray-700'}`}>{team.n}</span>
    </div>
  )
}

export default function Chaveamento() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'grupos' | 'matamata'>('grupos')
  const [bolao, setBolao] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('predictions')
      .select('data')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        if (data?.data) setBolao(data.data)
        setLoading(false)
      })
  }, [user])

  const scores = bolao?.scores || {}
  const bracket = bolao?.bracket || {}
  const bracketWinners = bolao?.bracketWinners || {}
  const penaltyWinners = bolao?.penaltyWinners || {}

  const getWinner = (st: string, i: number): Team | null => {
    return penaltyWinners[st]?.[i] || bracketWinners[st]?.[i] || null
  }

  const STAGE_LABELS: Record<string, string> = {
    r32: 'Rodada de 32', oitavas: 'Oitavas', quartas: 'Quartas', semi: 'Semifinal', final: 'Final'
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-black text-3xl tracking-widest mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>CHAVEAMENTO</h1>
        <p className="text-gray-400 text-sm">Visualize seu bolão completo da Copa do Mundo 2026</p>
      </div>

      {/* Campeão apostado */}
      {(() => {
        const champion = (bracketWinners['final'] || []).find(Boolean) || penaltyWinners['final']?.[0]
        return champion ? (
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 mb-6 flex items-center gap-4">
            <div className="text-3xl">🏆</div>
            <div>
              <p className="text-xs font-bold text-yellow-700 tracking-widest mb-1">SEU CAMPEÃO APOSTADO</p>
              <div className="flex items-center gap-2">
                <Flag code={champion.c} size="md" />
                <span className="font-black text-xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{champion.n}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 mb-6 text-center text-gray-400 text-sm">
            ⏳ Preencha o bolão até a Final para revelar seu campeão
          </div>
        )
      })()}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {[{ id: 'grupos', label: '⚽ GRUPOS' }, { id: 'matamata', label: '🏆 MATA-MATA' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 text-xs font-semibold tracking-widest border-b-2 transition ${
              activeTab === tab.id ? 'border-yellow-400 text-black' : 'border-transparent text-gray-400 hover:text-black'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ABA GRUPOS */}
      {activeTab === 'grupos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GROUPS.map((g, gi) => {
            const s = scores[gi] || {}
            return (
              <div key={gi} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-black px-4 py-2 flex items-center justify-between">
                  <span className="font-black text-yellow-400 tracking-widest text-sm" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    GRUPO {g.name}
                  </span>
                </div>
                {/* Times do grupo */}
                <div className="px-3 py-2 border-b border-gray-100">
                  <div className="flex flex-wrap gap-1">
                    {g.teams.map(t => (
                      <span key={t.n} className="flex items-center gap-1 text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded">
                        <Flag code={t.c} />{t.n}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Placares apostados */}
                <div className="divide-y divide-gray-50">
                  {MATCHES.map(([ai, bi]) => {
                    const key = `${ai}-${bi}`
                    const sa = s[`${key}-a`]
                    const sb = s[`${key}-b`]
                    const filled = sa !== undefined && sa !== '' && sb !== undefined && sb !== ''
                    return (
                      <div key={key} className="flex items-center gap-2 px-3 py-2">
                        <span className="flex items-center gap-1 flex-1 text-xs">
                          <Flag code={g.teams[ai].c} />
                          <span className="text-gray-600 truncate">{g.teams[ai].n}</span>
                        </span>
                        <span className={`text-xs font-black px-2 py-0.5 rounded ${filled ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {filled ? `${sa} × ${sb}` : '? × ?'}
                        </span>
                        <span className="flex items-center gap-1 flex-1 justify-end text-xs">
                          <span className="text-gray-600 truncate">{g.teams[bi].n}</span>
                          <Flag code={g.teams[bi].c} />
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ABA MATA-MATA */}
      {activeTab === 'matamata' && (
        <div className="flex flex-col gap-8">
          {['r32', 'oitavas', 'quartas', 'semi', 'final'].map(st => {
            const pairs = bracket[st] || []
            const isEmpty = pairs.length === 0
            return (
              <div key={st}>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="font-black text-sm tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    {STAGE_LABELS[st].toUpperCase()}
                  </h2>
                  <div className="h-px flex-1 bg-gray-200"></div>
                  {isEmpty && <span className="text-xs text-gray-400">Não preenchido</span>}
                </div>
                {isEmpty ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Array.from({ length: st === 'r32' ? 16 : st === 'oitavas' ? 8 : st === 'quartas' ? 4 : st === 'semi' ? 2 : 1 }).map((_, i) => (
                      <div key={i} className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-2">
                        <EmptySlot label="A definir" />
                        <div className="text-center text-gray-300 text-xs my-1">×</div>
                        <EmptySlot label="A definir" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`grid gap-2 ${
                    st === 'r32' ? 'grid-cols-2 md:grid-cols-4' :
                    st === 'oitavas' ? 'grid-cols-2 md:grid-cols-4' :
                    st === 'quartas' ? 'grid-cols-2 md:grid-cols-2' :
                    st === 'semi' ? 'grid-cols-1 md:grid-cols-2' :
                    'grid-cols-1 max-w-sm mx-auto'
                  }`}>
                    {pairs.map((pair: any, i: number) => {
                      const ta = pair?.[0] as Team | null
                      const tb = pair?.[1] as Team | null
                      const winner = getWinner(st, i)
                      return (
                        <div key={i} className={`rounded-lg border p-2 ${
                          st === 'final' ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-white'
                        }`}>
                          <TeamSlot team={ta} isWinner={winner?.n === ta?.n} />
                          <div className="text-center text-gray-300 text-xs my-1">×</div>
                          <TeamSlot team={tb} isWinner={winner?.n === tb?.n} />
                          {winner && (
                            <div className="mt-1.5 text-center">
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">
                                ✓ {winner.n}
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}