import { useState } from 'react'
 
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
 
function buildR32(classified: Record<number, Team[]>, thirds: Standing[]): (Team | null)[][] {
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
  const c = classified
  return [
    [c[0]?.[1], c[1]?.[1]], [c[4]?.[0], t[4]], [c[5]?.[0], c[2]?.[1]], [c[2]?.[0], c[5]?.[1]],
    [c[8]?.[0], t[8]], [c[4]?.[1], c[8]?.[1]], [c[0]?.[0], t[0]], [c[11]?.[0], t[11]],
    [c[3]?.[0], t[3]], [c[6]?.[0], t[6]], [c[10]?.[1], c[11]?.[1]], [c[7]?.[0], c[9]?.[1]],
    [c[1]?.[0], t[1]], [c[9]?.[0], c[7]?.[1]], [c[10]?.[0], t[10]], [c[3]?.[1], c[6]?.[1]],
  ]
}
 
function Flag({ code, size = 'md' }: { code: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: '0.9rem', md: '1.2rem', lg: '1.6rem' }
  return <span className={`fi fi-${code} rounded-sm`} style={{ fontSize: sizes[size], lineHeight: 1, flexShrink: 0 }} />
}
 
function TeamBall({ team, onClick, isWinner, isLoser, size = 'md' }: {
  team: Team | null, onClick?: () => void, isWinner?: boolean, isLoser?: boolean, size?: 'sm' | 'md'
}) {
  const dim = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'
  const flagSize = size === 'sm' ? 'sm' : 'md'
  if (!team) return (
    <div className={`${dim} rounded-full border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0`} />
  )
  return (
    <button
      onClick={onClick}
      className={`${dim} rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
        ${isWinner ? 'border-green-500 bg-green-50 scale-110 shadow-sm' :
          isLoser ? 'border-gray-200 bg-gray-50 opacity-40' :
          onClick ? 'border-gray-300 bg-white hover:border-green-400 hover:scale-105 cursor-pointer' :
          'border-gray-200 bg-white cursor-default'}`}
    >
      <Flag code={team.c} size={flagSize} />
    </button>
  )
}
 
function MatchSlot({ teamA, teamB, winner, onPick, matchNum }: {
  teamA: Team | null, teamB: Team | null, winner: Team | null,
  onPick: (team: Team) => void, matchNum?: number
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      {matchNum !== undefined && <span className="text-xs text-gray-300 font-mono">{matchNum + 1}</span>}
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1.5">
          <TeamBall team={teamA} onClick={teamA && teamB ? () => onPick(teamA) : undefined}
            isWinner={!!winner && winner.n === teamA?.n} isLoser={!!winner && winner.n !== teamA?.n} />
          {teamA && <span className="text-xs text-gray-500 max-w-14 truncate hidden md:block">{teamA.n}</span>}
        </div>
        <span className="text-gray-300 text-xs leading-none">×</span>
        <div className="flex items-center gap-1.5">
          <TeamBall team={teamB} onClick={teamA && teamB ? () => onPick(teamB) : undefined}
            isWinner={!!winner && winner.n === teamB?.n} isLoser={!!winner && winner.n !== teamB?.n} />
          {teamB && <span className="text-xs text-gray-500 max-w-14 truncate hidden md:block">{teamB.n}</span>}
        </div>
      </div>
    </div>
  )
}
 
export default function Chaveamento() {
  const [activeTab, setActiveTab] = useState<'simulacao' | 'aovivo'>('simulacao')
  const [simStep, setSimStep] = useState<'grupos' | 'bracket'>('grupos')
 
  // Grupos: classified[gi] = [1st, 2nd, 3rd]
  const [classified, setClassified] = useState<Record<number, (Team | null)[]>>(
    Object.fromEntries(GROUPS.map((_, i) => [i, [null, null, null]]))
  )
 
  // Bracket
  const [r32, setR32] = useState<(Team | null)[][]>(Array(16).fill(null).map(() => [null, null]))
  const [oitavas, setOitavas] = useState<(Team | null)[][]>(Array(8).fill(null).map(() => [null, null]))
  const [quartas, setQuartas] = useState<(Team | null)[][]>(Array(4).fill(null).map(() => [null, null]))
  const [semi, setSemi] = useState<(Team | null)[][]>(Array(2).fill(null).map(() => [null, null]))
  const [final, setFinal] = useState<(Team | null)[][]>([[null, null]])
  const [winners, setWinners] = useState<Record<string, (Team | null)[]>>({
    r32: Array(16).fill(null), oitavas: Array(8).fill(null),
    quartas: Array(4).fill(null), semi: Array(2).fill(null), final: Array(1).fill(null)
  })
 
  const selectClassified = (gi: number, ti: number) => {
    const team = GROUPS[gi].teams[ti]
    const sel = [...(classified[gi] || [null, null, null])]
    const pos = sel.findIndex(t => t?.n === team.n)
    if (pos >= 0) {
      sel.splice(pos, 1)
      sel.push(null)
    } else {
      const empty = sel.indexOf(null)
      if (empty >= 0) sel[empty] = team
    }
    setClassified(prev => ({ ...prev, [gi]: sel }))
  }
 
  const allGroupsDone = GROUPS.every((_, gi) => classified[gi]?.[1] !== null)
 
  const startBracket = () => {
    const cls: Record<number, Team[]> = {}
    const thirds: Standing[] = []
    GROUPS.forEach((_, gi) => {
      const sel = classified[gi] || []
      cls[gi] = [sel[0]!, sel[1]!].filter(Boolean)
      if (sel[2]) thirds.push({ team: sel[2], pts: 0, saldo: 0, gf: 0, groupName: GROUPS[gi].name })
    })
    const pairs = buildR32(cls, thirds)
    setR32(pairs.map(p => p || [null, null]))
    setOitavas(Array(8).fill(null).map(() => [null, null]))
    setQuartas(Array(4).fill(null).map(() => [null, null]))
    setSemi(Array(2).fill(null).map(() => [null, null]))
    setFinal([[null, null]])
    setWinners({ r32: Array(16).fill(null), oitavas: Array(8).fill(null), quartas: Array(4).fill(null), semi: Array(2).fill(null), final: Array(1).fill(null) })
    setSimStep('bracket')
  }
 
  const pickWinner = (stage: string, idx: number, team: Team) => {
    const newW = { ...winners, [stage]: [...(winners[stage] || [])] }
    newW[stage][idx] = team
 
    const nextStage: Record<string, string> = { r32: 'oitavas', oitavas: 'quartas', quartas: 'semi', semi: 'final' }
    const setPairs: Record<string, React.Dispatch<React.SetStateAction<(Team | null)[][]>>> = {
      oitavas: setOitavas, quartas: setQuartas, semi: setSemi, final: setFinal
    }
    const next = nextStage[stage]
    if (next) {
      const pairIdx = Math.floor(idx / 2)
      const partnerIdx = idx % 2 === 0 ? idx + 1 : idx - 1
      const partner = newW[stage][partnerIdx]
      if (partner) {
        const a = idx % 2 === 0 ? team : partner
        const b = idx % 2 === 0 ? partner : team
        setPairs[next](prev => {
          const updated = [...prev]
          updated[pairIdx] = [a, b]
          return updated
        })
        newW[next] = [...(newW[next] || [])]
        newW[next][pairIdx] = null
      }
    }
    setWinners(newW)
  }
 
  const champion = winners.final?.[0]
 
  // Left side: matches 0-7, Right side: matches 8-15
  const leftPairs = r32.slice(0, 8)
  const rightPairs = r32.slice(8, 16)
  const leftWinners = (winners.r32 || []).slice(0, 8)
  const rightWinners = (winners.r32 || []).slice(8, 16)
 
  // Oitavas: left 0-3, right 4-7
  const oitL = oitavas.slice(0, 4)
  const oitR = oitavas.slice(4, 8)
  const oitWL = (winners.oitavas || []).slice(0, 4)
  const oitWR = (winners.oitavas || []).slice(4, 8)
 
  // Quartas: left 0-1, right 2-3
  const qtL = quartas.slice(0, 2)
  const qtR = quartas.slice(2, 4)
  const qtWL = (winners.quartas || []).slice(0, 2)
  const qtWR = (winners.quartas || []).slice(2, 4)
 
  // Semi: left 0, right 1

 
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-black text-3xl tracking-widest mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>CHAVEAMENTO</h1>
        <p className="text-gray-400 text-sm">Copa do Mundo 2026 — USA · CAN · MEX · 11 Jun a 19 Jul</p>
      </div>
 
      {/* Tabs principais */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { id: 'simulacao', label: '⚽ SIMULAÇÃO' },
          { id: 'aovivo', label: '🔴 AO VIVO' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 text-xs font-semibold tracking-widest border-b-2 transition ${
              activeTab === tab.id ? 'border-yellow-400 text-black' : 'border-transparent text-gray-400 hover:text-black'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>
 
      {/* ABA AO VIVO */}
      {activeTab === 'aovivo' && (
        <div className="flex flex-col gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
            <p className="text-yellow-800 text-xs font-medium">
              ⏳ Os confrontos serão preenchidos automaticamente conforme os jogos acontecem
            </p>
          </div>
          {['RODADA DE 32', 'OITAVAS DE FINAL', 'QUARTAS DE FINAL', 'SEMIFINAL', 'FINAL'].map((label, si) => {
            const counts = [16, 8, 4, 2, 1]
            const cols = ['grid-cols-2 md:grid-cols-4', 'grid-cols-2 md:grid-cols-4', 'grid-cols-2', 'grid-cols-1 md:grid-cols-2', 'grid-cols-1 max-w-xs mx-auto']
            return (
              <div key={label}>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="font-black text-sm tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{label}</h2>
                  <div className="h-px flex-1 bg-gray-200"></div>
                  <span className="text-xs text-gray-400">{counts[si]} {counts[si] === 1 ? 'jogo' : 'jogos'}</span>
                </div>
                <div className={`grid ${cols[si]} gap-2`}>
                  {Array.from({ length: counts[si] }).map((_, i) => (
                    <div key={i} className={`rounded-lg border p-2 bg-white ${si === 4 ? 'border-yellow-300' : 'border-gray-200'}`}>
                      <div className="flex items-center gap-2 px-1 py-1">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex-shrink-0" />
                        <span className="text-xs text-gray-300">A definir</span>
                      </div>
                      <div className="text-center text-gray-200 text-xs my-0.5">×</div>
                      <div className="flex items-center gap-2 px-1 py-1">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex-shrink-0" />
                        <span className="text-xs text-gray-300">A definir</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
 
      {/* ABA SIMULAÇÃO */}
      {activeTab === 'simulacao' && (
        <div>
          <p className="text-gray-400 text-sm mb-6">Simule a Copa do Mundo 2026 escolhendo os classificados de cada grupo e avançando fase a fase até o campeão.</p>
 
          {/* Sub-tabs */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => setSimStep('grupos')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${simStep === 'grupos' ? 'bg-black text-yellow-400' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              1. GRUPOS
            </button>
            <button onClick={() => allGroupsDone && setSimStep('bracket')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
                simStep === 'bracket' ? 'bg-black text-yellow-400' :
                allGroupsDone ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}>
              2. MATA-MATA
            </button>
          </div>
 
          {/* STEP GRUPOS */}
          {simStep === 'grupos' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {GROUPS.map((g, gi) => {
                  const sel = classified[gi] || [null, null, null]
                  const done = sel[1] !== null
                  return (
                    <div key={g.name} className={`bg-white border rounded-xl overflow-hidden ${done ? 'border-green-200' : 'border-gray-200'}`}>
                      <div className={`px-4 py-2 flex items-center justify-between ${done ? 'bg-green-600' : 'bg-black'}`}>
                        <span className="font-black text-yellow-400 tracking-widest text-sm" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                          GRUPO {g.name}
                        </span>
                        {done && <span className="text-white text-xs font-bold">✓</span>}
                      </div>
                      <div className="p-2">
                        {g.teams.map((t, ti) => {
                          const pos = sel.findIndex(s => s?.n === t.n)
                          const labels = ['1°', '2°', '3°']
                          const colors = [
                            'bg-green-50 border-green-300',
                            'bg-blue-50 border-blue-200',
                            'bg-gray-50 border-gray-200',
                          ]
                          const badgeColors = ['bg-green-600 text-white', 'bg-blue-500 text-white', 'bg-gray-400 text-white']
                          return (
                            <button key={t.n} onClick={() => selectClassified(gi, ti)}
                              className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg mb-1 border transition text-left
                                ${pos >= 0 ? colors[pos] : 'border-transparent hover:bg-gray-50'}`}>
                              <div className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center flex-shrink-0">
                                <Flag code={t.c} size="sm" />
                              </div>
                              <span className="text-xs font-medium flex-1 truncate">{t.n}</span>
                              {pos >= 0 && (
                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${badgeColors[pos]}`}>
                                  {labels[pos]}
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
 
              {/* Progress */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500">GRUPOS COMPLETOS</span>
                  <span className="text-xs font-bold text-green-600">
                    {GROUPS.filter((_, gi) => classified[gi]?.[1] !== null).length}/12
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full transition-all"
                    style={{ width: `${(GROUPS.filter((_, gi) => classified[gi]?.[1] !== null).length / 12) * 100}%` }} />
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
 
          {/* STEP BRACKET */}
          {simStep === 'bracket' && (
            <div>
              <p className="text-xs text-gray-400 mb-4">Clique no time vencedor de cada confronto para avançar de fase.</p>
 
              {/* Bracket espelhado */}
              <div className="overflow-x-auto">
                <div style={{ minWidth: '700px' }}>
 
                  {/* R32 */}
                  <div className="mb-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-black tracking-widest text-gray-400" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>RODADA DE 32</span>
                      <div className="h-px flex-1 bg-gray-100" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Esquerda */}
                      <div className="grid grid-cols-4 gap-1">
                        {leftPairs.map((pair, i) => (
                          <MatchSlot key={i} teamA={pair[0]} teamB={pair[1]}
                            winner={leftWinners[i]} matchNum={i}
                            onPick={(t) => pickWinner('r32', i, t)} />
                        ))}
                      </div>
                      {/* Direita */}
                      <div className="grid grid-cols-4 gap-1">
                        {rightPairs.map((pair, i) => (
                          <MatchSlot key={i+8} teamA={pair[0]} teamB={pair[1]}
                            winner={rightWinners[i]} matchNum={i+8}
                            onPick={(t) => pickWinner('r32', i+8, t)} />
                        ))}
                      </div>
                    </div>
                  </div>
 
                  {/* Oitavas */}
                  <div className="mb-1 mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-black tracking-widest text-gray-400" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>OITAVAS DE FINAL</span>
                      <div className="h-px flex-1 bg-gray-100" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="grid grid-cols-4 gap-1">
                        {oitL.map((pair, i) => (
                          <MatchSlot key={i} teamA={pair[0]} teamB={pair[1]}
                            winner={oitWL[i]} onPick={(t) => pickWinner('oitavas', i, t)} />
                        ))}
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {oitR.map((pair, i) => (
                          <MatchSlot key={i+4} teamA={pair[0]} teamB={pair[1]}
                            winner={oitWR[i]} onPick={(t) => pickWinner('oitavas', i+4, t)} />
                        ))}
                      </div>
                    </div>
                  </div>
 
                  {/* Quartas */}
                  <div className="mb-1 mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-black tracking-widest text-gray-400" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>QUARTAS DE FINAL</span>
                      <div className="h-px flex-1 bg-gray-100" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        {qtL.map((pair, i) => (
                          <MatchSlot key={i} teamA={pair[0]} teamB={pair[1]}
                            winner={qtWL[i]} onPick={(t) => pickWinner('quartas', i, t)} />
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {qtR.map((pair, i) => (
                          <MatchSlot key={i+2} teamA={pair[0]} teamB={pair[1]}
                            winner={qtWR[i]} onPick={(t) => pickWinner('quartas', i+2, t)} />
                        ))}
                      </div>
                    </div>
                  </div>
 
                  {/* Semi */}
                  <div className="mb-1 mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-black tracking-widest text-gray-400" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>SEMIFINAL</span>
                      <div className="h-px flex-1 bg-gray-100" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex justify-center">
                        <MatchSlot teamA={semi[0]?.[0]} teamB={semi[0]?.[1]}
                          winner={winners.semi?.[0]} onPick={(t) => pickWinner('semi', 0, t)} />
                      </div>
                      <div className="flex justify-center">
                        <MatchSlot teamA={semi[1]?.[0]} teamB={semi[1]?.[1]}
                          winner={winners.semi?.[1]} onPick={(t) => pickWinner('semi', 1, t)} />
                      </div>
                    </div>
                  </div>
 
                  {/* Final */}
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-black tracking-widest text-yellow-500" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>GRANDE FINAL</span>
                      <div className="h-px flex-1 bg-yellow-200" />
                    </div>
                    <div className="flex justify-center">
                      <div className="bg-white border-2 border-yellow-300 rounded-xl p-4 flex flex-col items-center gap-3">
                        <div className="flex items-center gap-6">
                          {/* Finalista esquerdo */}
                          <div className="flex flex-col items-center gap-1">
                            <TeamBall team={final[0]?.[0]} size="md"
                              onClick={final[0]?.[0] && final[0]?.[1] ? () => pickWinner('final', 0, final[0][0]!) : undefined}
                              isWinner={!!champion && champion.n === final[0]?.[0]?.n}
                              isLoser={!!champion && champion.n !== final[0]?.[0]?.n} />
                            <span className="text-xs text-gray-500 max-w-16 truncate text-center">{final[0]?.[0]?.n || '—'}</span>
                          </div>
                          <span className="text-2xl font-black text-gray-200" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>VS</span>
                          {/* Finalista direito */}
                          <div className="flex flex-col items-center gap-1">
                            <TeamBall team={final[0]?.[1]} size="md"
                              onClick={final[0]?.[0] && final[0]?.[1] ? () => pickWinner('final', 0, final[0][1]!) : undefined}
                              isWinner={!!champion && champion.n === final[0]?.[1]?.n}
                              isLoser={!!champion && champion.n !== final[0]?.[1]?.n} />
                            <span className="text-xs text-gray-500 max-w-16 truncate text-center">{final[0]?.[1]?.n || '—'}</span>
                          </div>
                        </div>
 
                        {champion && (
                          <div className="text-center border-t border-yellow-200 pt-3 w-full">
                            <p className="text-xs text-yellow-600 font-bold tracking-widest mb-1">🏆 CAMPEÃO</p>
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-10 h-10 rounded-full border-2 border-yellow-400 bg-yellow-50 flex items-center justify-center">
                                <Flag code={champion.c} size="md" />
                              </div>
                              <span className="font-black text-lg tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                                {champion.n}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
 
                </div>
              </div>
 
              <button onClick={() => setSimStep('grupos')}
                className="mt-6 text-xs text-gray-400 hover:text-black transition">
                ← Voltar aos grupos
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
