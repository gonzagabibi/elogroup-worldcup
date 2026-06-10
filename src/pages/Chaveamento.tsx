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
 
const TOTAL_H = 576
const CONNECTOR_W = 18
 
function Connector({ count, side }: { count: number; side: 'L' | 'R' }) {
  const cellH = TOTAL_H / count
  const paths: string[] = []
  for (let i = 0; i < count; i += 2) {
    const y1 = cellH * i + cellH / 2
    const y2 = cellH * (i + 1) + cellH / 2
    const ym = (y1 + y2) / 2
    if (side === 'L') {
      paths.push(`M0,${y1} H${CONNECTOR_W/2} V${ym} M0,${y2} H${CONNECTOR_W/2} V${ym} M${CONNECTOR_W/2},${ym} H${CONNECTOR_W}`)
    } else {
      paths.push(`M${CONNECTOR_W},${y1} H${CONNECTOR_W/2} V${ym} M${CONNECTOR_W},${y2} H${CONNECTOR_W/2} V${ym} M${CONNECTOR_W/2},${ym} H0`)
    }
  }
  return (
    <svg width={CONNECTOR_W} height={TOTAL_H} style={{ display: 'block', flexShrink: 0 }}>
      {paths.map((d, i) => <path key={i} d={d} fill="none" stroke="#D3D1C7" strokeWidth="1.5" />)}
    </svg>
  )
}
 
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
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`flex items-center gap-1.5 px-1.5 py-1 rounded h-7 text-left transition-all
        ${isW ? 'bg-green-50' : isL ? 'opacity-30' : onClick ? 'hover:bg-gray-50' : ''}
        ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0
        ${isW ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
        <Flag code={team.c} size="sm" />
      </div>
      <span className={`text-xs max-w-14 truncate ${isL ? 'text-gray-300' : 'text-gray-700'}`}>{team.n}</span>
    </button>
  )
}
 
function BracketCol({ pairs, winners, label, onPick }: {
  pairs: (Team | null)[][]
  winners: (Team | null)[]
  label: string
  onPick: (matchIdx: number, team: Team) => void
}) {
  const n = pairs.length
  const cellH = TOTAL_H / n
  return (
    <div style={{ flexShrink: 0 }}>
      <div className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-1 text-center" style={{ fontSize: 9 }}>{label}</div>
      <div style={{ height: TOTAL_H }}>
        {pairs.map((pair, i) => {
          const ta = pair?.[0], tb = pair?.[1]
          const w = winners[i]
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
 
export default function Chaveamento() {
  const [activeTab, setActiveTab] = useState<'simulacao' | 'aovivo'>('simulacao')
  const [simStep, setSimStep] = useState<'grupos' | 'bracket'>('grupos')
  const [classified, setClassified] = useState<Record<number, (Team | null)[]>>(
    Object.fromEntries(GROUPS.map((_, i) => [i, [null, null, null]]))
  )
 
  // Bracket state
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
 
    const next = { r32: 'oit', oit: 'qt', qt: 'semi' } as Record<string, string>
    const nextStage = next[stage]
    const pi = Math.floor(mi / 2)
    const partner = newW[stage][mi % 2 === 0 ? mi + 1 : mi - 1]
 
    if (!nextStage) {
      setFinalPair(prev => { const n = [...prev]; n[side === 'L' ? 0 : 1] = team; return n })
      setChampion(null)
      return
    }
 
    if (partner) {
      const newPair: (Team | null)[] = mi % 2 === 0 ? [team, partner] : [partner, team]
      if (side === 'L') {
        if (nextStage === 'oit') setOitL(prev => { const n = [...prev]; n[pi] = newPair; return n })
        else if (nextStage === 'qt') setQtL(prev => { const n = [...prev]; n[pi] = newPair; return n })
        else if (nextStage === 'semi') setSemiL([[newPair[0], newPair[1]]])
        newW[nextStage] = [...(newW[nextStage] || [])]; newW[nextStage][pi] = null; setW(newW)
      } else {
        if (nextStage === 'oit') setOitR(prev => { const n = [...prev]; n[pi] = newPair; return n })
        else if (nextStage === 'qt') setQtR(prev => { const n = [...prev]; n[pi] = newPair; return n })
        else if (nextStage === 'semi') setSemiR([[newPair[0], newPair[1]]])
        newW[nextStage] = [...(newW[nextStage] || [])]; newW[nextStage][pi] = null; setW(newW)
      }
    }
    if (nextStage === 'semi' || nextStage === 'qt' || nextStage === 'oit') {
      setFinalPair(prev => { const n = [...prev]; n[side === 'L' ? 0 : 1] = null; return n })
      setChampion(null)
    }
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
            className={`px-6 py-3 text-xs font-semibold tracking-widest border-b-2 transition ${
              activeTab === tab.id ? 'border-yellow-400 text-black' : 'border-transparent text-gray-400 hover:text-black'
            }`}>{tab.label}</button>
        ))}
      </div>
 
      {/* AO VIVO */}
      {activeTab === 'aovivo' && (
        <div className="flex flex-col gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
            <p className="text-yellow-800 text-xs font-medium">⏳ Os confrontos serão preenchidos automaticamente conforme os jogos acontecem</p>
          </div>
          {['RODADA DE 32','OITAVAS DE FINAL','QUARTAS DE FINAL','SEMIFINAL','FINAL'].map((label, si) => {
            const counts = [16,8,4,2,1]
            const cols = ['grid-cols-2 md:grid-cols-4','grid-cols-2 md:grid-cols-4','grid-cols-2','grid-cols-1 md:grid-cols-2','grid-cols-1 max-w-xs mx-auto']
            return (
              <div key={label}>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="font-black text-sm tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{label}</h2>
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-xs text-gray-400">{counts[si]} {counts[si]===1?'jogo':'jogos'}</span>
                </div>
                <div className={`grid ${cols[si]} gap-2`}>
                  {Array.from({ length: counts[si] }).map((_, i) => (
                    <div key={i} className={`rounded-lg border p-2 bg-white ${si===4?'border-yellow-300':'border-gray-200'}`}>
                      <div className="flex items-center gap-2 px-1 py-1"><div className="w-5 h-5 rounded-full bg-gray-100 flex-shrink-0" /><span className="text-xs text-gray-300">A definir</span></div>
                      <div className="text-center text-gray-200 text-xs my-0.5">×</div>
                      <div className="flex items-center gap-2 px-1 py-1"><div className="w-5 h-5 rounded-full bg-gray-100 flex-shrink-0" /><span className="text-xs text-gray-300">A definir</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
 
      {/* SIMULAÇÃO */}
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
 
          {/* GRUPOS */}
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
 
          {/* BRACKET */}
          {simStep === 'bracket' && (
            <div>
              <p className="text-xs text-gray-400 mb-4">Clique no time vencedor de cada confronto para avançar de fase.</p>
              <div style={{ overflowX: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', minWidth: 900 }}>
 
                  {/* LADO ESQUERDO */}
                  <BracketCol pairs={r32.slice(0,8)} winners={winnersL.r32.slice(0,8)} label="Rodada de 32"
                    onPick={(mi, t) => pickSide('L','r32',mi,t)} />
                  <Connector count={8} side="L" />
                  <BracketCol pairs={oitL} winners={winnersL.oit} label="Oitavas"
                    onPick={(mi, t) => pickSide('L','oit',mi,t)} />
                  <Connector count={4} side="L" />
                  <BracketCol pairs={qtL} winners={winnersL.qt} label="Quartas"
                    onPick={(mi, t) => pickSide('L','qt',mi,t)} />
                  <Connector count={2} side="L" />
                  <BracketCol pairs={semiL} winners={winnersL.semi} label="Semi"
                    onPick={(mi, t) => pickSide('L','semi',mi,t)} />
                  <Connector count={1} side="L" />
 
                  {/* FINAL CENTRO */}
                  <div style={{ flexShrink: 0, width: 110 }}>
                    <div className="text-center mb-1" style={{ fontSize: 9, fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Final</div>
                    <div style={{ height: TOTAL_H, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <TeamSlot team={finalPair[0]} winner={champion}
                        onClick={finalPair[0] && finalPair[1] ? () => setChampion(finalPair[0]) : undefined} />
                      <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>×</span>
                      <TeamSlot team={finalPair[1]} winner={champion}
                        onClick={finalPair[0] && finalPair[1] ? () => setChampion(finalPair[1]) : undefined} />
                      {champion && (
                        <div className="text-center mt-3">
                          <div style={{ fontSize: 24 }}>🏆</div>
                          <div style={{ fontSize: 9, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '2px 0' }}>Campeão</div>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <div className="w-6 h-6 rounded-full border-2 border-yellow-400 bg-yellow-50 flex items-center justify-center">
                              <Flag code={champion.c} size="sm" />
                            </div>
                            <span className="font-black text-sm tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{champion.n}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
 
                  {/* LADO DIREITO */}
                  <Connector count={1} side="R" />
                  <BracketCol pairs={semiR} winners={winnersR.semi} label="Semi"
                    onPick={(mi, t) => pickSide('R','semi',mi,t)} />
                  <Connector count={2} side="R" />
                  <BracketCol pairs={qtR} winners={winnersR.qt} label="Quartas"
                    onPick={(mi, t) => pickSide('R','qt',mi,t)} />
                  <Connector count={4} side="R" />
                  <BracketCol pairs={oitR} winners={winnersR.oit} label="Oitavas"
                    onPick={(mi, t) => pickSide('R','oit',mi,t)} />
                  <Connector count={8} side="R" />
                  <BracketCol pairs={r32.slice(8,16)} winners={winnersR.r32.slice(0,8)} label="Rodada de 32"
                    onPick={(mi, t) => pickSide('R','r32',mi,t)} />
 
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
