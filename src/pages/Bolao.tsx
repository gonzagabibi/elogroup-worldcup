import { useState, useEffect, useRef } from 'react'
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
type Scores = Record<string, string>

function Flag({ code, size = 'md' }: { code: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizes = { sm: '1rem', md: '1.4rem', lg: '2rem', xl: '5rem' }
  return <span className={`fi fi-${code} rounded-sm`} style={{ fontSize: sizes[size], lineHeight: 1, flexShrink: 0 }}></span>
}

function computeClassified(gi: number, scores: Record<number, Scores>): Team[] {
  const group = GROUPS[gi]
  const s = scores[gi] || {}
  const standings = group.teams.map((team, ti) => {
    let pts = 0, gf = 0, gc = 0
    MATCHES.forEach(([a, b]) => {
      const sa = parseInt(s[`${a}-${b}-a`] ?? '')
      const sb = parseInt(s[`${a}-${b}-b`] ?? '')
      if (isNaN(sa) || isNaN(sb)) return
      if (ti === a) { gf += sa; gc += sb; if (sa > sb) pts += 3; else if (sa === sb) pts += 1 }
      if (ti === b) { gf += sb; gc += sa; if (sb > sa) pts += 3; else if (sa === sb) pts += 1 }
    })
    return { team, pts, saldo: gf - gc, gf }
  })
  standings.sort((a, b) =>
    b.pts !== a.pts ? b.pts - a.pts :
    b.saldo !== a.saldo ? b.saldo - a.saldo :
    b.gf - a.gf
  )
  return standings.slice(0, 2).map(s => s.team)
}

function allFilled(gi: number, scores: Record<number, Scores>): boolean {
  const s = scores[gi] || {}
  return MATCHES.every(([a, b]) =>
    s[`${a}-${b}-a`] !== undefined && s[`${a}-${b}-a`] !== '' &&
    s[`${a}-${b}-b`] !== undefined && s[`${a}-${b}-b`] !== ''
  )
}

export default function Bolao() {
  const { user } = useAuth()
  const [stage, setStage] = useState('grupos')
  const [scores, setScores] = useState<Record<number, Scores>>({})
  const [bracket, setBracket] = useState<Record<string, Team[][]>>({})
  const [bracketScores, setBracketScores] = useState<Record<string, Scores>>({})
  const [bracketWinners, setBracketWinners] = useState<Record<string, (Team | null)[]>>({})
  const [penaltyWinners, setPenaltyWinners] = useState<Record<string, (Team | null)[]>>({})
  const [penaltyModal, setPenaltyModal] = useState<{ stage: string; idx: number; ta: Team; tb: Team } | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [locked, setLocked] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Carrega bolão salvo ao entrar na página
  useEffect(() => {
    if (!user) return
    supabase
      .from('predictions')
      .select('*')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        if (data?.data) {
          const d = data.data
          if (d.scores) setScores(d.scores)
          if (d.bracket) setBracket(d.bracket)
          if (d.bracketScores) setBracketScores(d.bracketScores)
          if (d.bracketWinners) setBracketWinners(d.bracketWinners)
          if (d.penaltyWinners) setPenaltyWinners(d.penaltyWinners)
          if (data.confirmed) { setConfirmed(true); setLocked(true) }
        }
        setLoading(false)
      })
  }, [user])

  // Salva automaticamente com debounce de 1s
  const autoSave = (newState: object) => {
    if (locked) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      if (!user) return
      setSaving(true)
      await supabase.from('predictions').upsert({
        user_id: user.id,
        data: newState,
        confirmed: false,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      setSaving(false)
    }, 1000)
  }

  const setScore = (gi: number, key: string, val: string) => {
    const newScores = { ...scores, [gi]: { ...scores[gi], [key]: val } }
    setScores(newScores)
    const newState = { scores: newScores, bracket, bracketScores, bracketWinners, penaltyWinners }
    autoSave(newState)
    if (allFilled(gi, newScores)) checkAndBuildR32(newScores, bracket, bracketScores, bracketWinners, penaltyWinners)
  }

  const checkAndBuildR32 = (
    newScores: Record<number, Scores>,
    br: Record<string, Team[][]>,
    bs: Record<string, Scores>,
    bw: Record<string, (Team | null)[]>,
    pw: Record<string, (Team | null)[]>
  ) => {
    const allClassified: Record<number, Team[]> = {}
    for (let gi = 0; gi < 12; gi++) {
      if (allFilled(gi, newScores)) allClassified[gi] = computeClassified(gi, newScores)
    }
    if (Object.keys(allClassified).length === 12) {
      const c = allClassified
      const pairs: Team[][] = [
        [c[0]?.[0], c[1]?.[1]], [c[2]?.[0], c[3]?.[1]],
        [c[4]?.[0], c[5]?.[1]], [c[6]?.[0], c[7]?.[1]],
        [c[8]?.[0], c[9]?.[1]], [c[10]?.[0], c[11]?.[1]],
        [c[1]?.[0], c[0]?.[1]], [c[3]?.[0], c[2]?.[1]],
        [c[5]?.[0], c[4]?.[1]], [c[7]?.[0], c[6]?.[1]],
        [c[9]?.[0], c[8]?.[1]], [c[11]?.[0], c[10]?.[1]],
        [c[0]?.[1], c[3]?.[0]], [c[1]?.[1], c[2]?.[0]],
        [c[4]?.[1], c[7]?.[0]], [c[5]?.[1], c[6]?.[0]],
      ]
      const newBracket = { ...br, r32: pairs }
      setBracket(newBracket)
      autoSave({ scores: newScores, bracket: newBracket, bracketScores: bs, bracketWinners: bw, penaltyWinners: pw })
    }
  }

  const allGroupsDone = Array.from({ length: 12 }, (_, gi) => allFilled(gi, scores)).every(Boolean)
  const getClassified = (gi: number): Team[] => allFilled(gi, scores) ? computeClassified(gi, scores) : []

  const updateWinner = (st: string, i: number, winner: Team, currentBW: Record<string, (Team | null)[]>, currentBracket: Record<string, Team[][]>, currentBS: Record<string, Scores>, currentPW: Record<string, (Team | null)[]>) => {
    const newWinners = { ...currentBW, [st]: [...(currentBW[st] || Array(16).fill(null))] }
    newWinners[st][i] = winner
    setBracketWinners(newWinners)
    const stageCounts: Record<string, number> = { r32: 16, oitavas: 8, quartas: 4, semi: 2 }
    const nextStages: Record<string, string> = { r32: 'oitavas', oitavas: 'quartas', quartas: 'semi', semi: 'final' }
    const count = stageCounts[st]
    const winners = newWinners[st] || []
    let newBracket = currentBracket
    if (winners.filter(Boolean).length === count) {
      const next = nextStages[st]
      if (next !== 'final') {
        const pairs: Team[][] = []
        for (let j = 0; j < count; j += 2) {
          if (winners[j] && winners[j + 1]) pairs.push([winners[j]!, winners[j + 1]!])
        }
        newBracket = { ...currentBracket, [next]: pairs }
        setBracket(newBracket)
      }
    }
    autoSave({ scores, bracket: newBracket, bracketScores: currentBS, bracketWinners: newWinners, penaltyWinners: currentPW })
  }

  const setBScore = (st: string, i: number, side: string, val: string, ta: Team, tb: Team) => {
    const newBS = { ...bracketScores, [st]: { ...bracketScores[st], [`${i}-${side}`]: val } }
    setBracketScores(newBS)
    autoSave({ scores, bracket, bracketScores: newBS, bracketWinners, penaltyWinners })
    const s = newBS[st]
    const sa = parseInt(s[`${i}-a`] || '')
    const sb = parseInt(s[`${i}-b`] || '')
    if (!isNaN(sa) && !isNaN(sb)) {
      if (sa === sb) setPenaltyModal({ stage: st, idx: i, ta, tb })
      else updateWinner(st, i, sa > sb ? ta : tb, bracketWinners, bracket, newBS, penaltyWinners)
    }
  }

  const confirmPenalty = (winner: Team) => {
    if (!penaltyModal) return
    const { stage: st, idx: i } = penaltyModal
    const newPW = { ...penaltyWinners, [st]: [...(penaltyWinners[st] || Array(16).fill(null))] }
    newPW[st][i] = winner
    setPenaltyWinners(newPW)
    setPenaltyModal(null)
    updateWinner(st, i, winner, bracketWinners, bracket, bracketScores, newPW)
  }

  const handleConfirm = async () => {
    if (!user) return
    setSaving(true)
    await supabase.from('predictions').upsert({
      user_id: user.id,
      data: { scores, bracket, bracketScores, bracketWinners, penaltyWinners },
      confirmed: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    setSaving(false)
    setConfirmed(true)
    setLocked(true)
  }

  const totalGroupMatches = 12 * 6
  const filledGroupMatches = Object.entries(scores).reduce((acc, [, s]) =>
    acc + MATCHES.filter(([a, b]) =>
      s[`${a}-${b}-a`] !== undefined && s[`${a}-${b}-a`] !== '' &&
      s[`${a}-${b}-b`] !== undefined && s[`${a}-${b}-b`] !== ''
    ).length, 0)
  const progress = Math.round((filledGroupMatches / totalGroupMatches) * 100)

  const finalists = (bracketWinners.semi || []).filter(Boolean) as Team[]
  const ta = finalists[0], tb = finalists[1]
  const finalS = bracketScores.final || {}
  const finalSa = parseInt(finalS['0-a'] || '')
  const finalSb = parseInt(finalS['0-b'] || '')
  const finalPenWinner = penaltyWinners.final?.[0] as Team | null
  const champion = finalPenWinner ? finalPenWinner :
    (!isNaN(finalSa) && !isNaN(finalSb) && finalSa !== finalSb) ? (finalSa > finalSb ? ta : tb) : null

  const tabs = [
    { id: 'grupos', label: 'GRUPOS', locked: false },
    { id: 'r32', label: 'RODADA DE 32', locked: !allGroupsDone },
    { id: 'oitavas', label: 'OITAVAS', locked: !bracket.oitavas },
    { id: 'quartas', label: 'QUARTAS', locked: !bracket.quartas },
    { id: 'semi', label: 'SEMIFINAL', locked: !bracket.semi },
    { id: 'final', label: 'FINAL', locked: (bracketWinners.semi || []).filter(Boolean).length < 2 },
  ]

  const renderBracketStage = (st: string) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {(bracket[st] || []).map((pair, i) => {
        const ta = pair?.[0], tb = pair?.[1]
        if (!ta || !tb) return (
          <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4 opacity-40">
            <span className="text-xs text-gray-400">⏳ A definir</span>
          </div>
        )
        const s = bracketScores[st] || {}
        const w = bracketWinners[st]?.[i]
        const penW = penaltyWinners[st]?.[i]
        const sa = s[`${i}-a`] || ''
        const sb = s[`${i}-b`] || ''
        const isTie = sa !== '' && sb !== '' && sa === sb
        return (
          <div key={i} className={`bg-white border rounded-xl p-4 flex items-center gap-3 ${isTie ? 'border-yellow-300' : 'border-gray-200'}`}>
            <span className={`flex items-center gap-2 flex-1 text-sm font-medium ${w?.n === ta.n ? 'text-green-600 font-bold' : ''}`}>
              <Flag code={ta.c} />{ta.n}
              {w?.n === ta.n && <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-bold">✓</span>}
              {penW?.n === ta.n && <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold">PEN</span>}
            </span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <input type="number" min="0" max="20" disabled={locked}
                value={sa} onChange={e => setBScore(st, i, 'a', e.target.value, ta, tb)}
                className="w-10 h-8 text-center border border-gray-200 rounded text-sm font-bold focus:outline-none focus:border-green-600 disabled:opacity-40" />
              <span className="text-gray-300 text-xs">×</span>
              <input type="number" min="0" max="20" disabled={locked}
                value={sb} onChange={e => setBScore(st, i, 'b', e.target.value, ta, tb)}
                className="w-10 h-8 text-center border border-gray-200 rounded text-sm font-bold focus:outline-none focus:border-green-600 disabled:opacity-40" />
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

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-400 text-sm">Carregando seu bolão...</p>
      </div>
    </div>
  )

  return (
    <div>
      {confirmed && (
        <div className="bg-green-600 text-white text-center py-3 px-6 rounded-xl mb-6 font-semibold tracking-wider">
          🎉 Bolão confirmado! Boa sorte na Copa! 🌍
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-black text-3xl tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>MEU BOLÃO</h1>
          <p className="text-gray-400 text-sm">Simule a Copa do Mundo 2026 completa</p>
        </div>
        <div className="flex items-center gap-3">
          {saving && <span className="text-xs text-gray-400 animate-pulse">💾 Salvando...</span>}
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-600 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="text-xs font-bold text-green-600">{progress}% grupos</span>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => !tab.locked && !locked && setStage(tab.id)}
            className={`px-4 py-3 text-xs font-semibold tracking-widest border-b-2 whitespace-nowrap transition ${
              stage === tab.id ? 'border-yellow-400 text-black' :
              tab.locked ? 'border-transparent text-gray-300 cursor-not-allowed' :
              'border-transparent text-gray-400 hover:text-black'
            }`}>
            {tab.label} {tab.locked ? '🔒' : ''}
          </button>
        ))}
      </div>

      {stage === 'grupos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GROUPS.map((g, gi) => {
            const cl = getClassified(gi)
            const filled = allFilled(gi, scores)
            return (
              <div key={gi} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-black px-4 py-2 flex items-center justify-between">
                  <span className="font-black text-yellow-400 tracking-widest text-sm" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>GRUPO {g.name}</span>
                  {filled && <span className="text-green-500 text-xs font-bold">✓ COMPLETO</span>}
                </div>
                {MATCHES.map(([ai, bi]) => {
                  const ta = g.teams[ai], tb = g.teams[bi]
                  const key = `${ai}-${bi}`
                  const s = scores[gi] || {}
                  return (
                    <div key={key} className="px-4 py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-2 flex-1 text-xs font-medium"><Flag code={ta.c} />{ta.n}</span>
                        <div className="flex items-center gap-1">
                          <input type="number" min="0" max="20" disabled={locked}
                            value={s[`${key}-a`] || ''} onChange={e => setScore(gi, `${key}-a`, e.target.value)}
                            className="w-10 h-8 text-center border border-gray-200 rounded text-sm font-bold focus:outline-none focus:border-green-600 disabled:opacity-40 disabled:cursor-not-allowed" />
                          <span className="text-gray-300 text-xs">×</span>
                          <input type="number" min="0" max="20" disabled={locked}
                            value={s[`${key}-b`] || ''} onChange={e => setScore(gi, `${key}-b`, e.target.value)}
                            className="w-10 h-8 text-center border border-gray-200 rounded text-sm font-bold focus:outline-none focus:border-green-600 disabled:opacity-40 disabled:cursor-not-allowed" />
                        </div>
                        <span className="flex items-center gap-2 flex-1 justify-end text-xs font-medium">{tb.n}<Flag code={tb.c} /></span>
                      </div>
                    </div>
                  )
                })}
                {cl.length > 0 && (
                  <div className="px-4 py-3 bg-green-50 border-t border-green-100">
                    <p className="text-xs text-green-700 font-bold mb-2">🏆 CLASSIFICADOS</p>
                    <div className="flex gap-2 flex-wrap">
                      {cl.map(t => (
                        <span key={t.n} className="flex items-center gap-1.5 border border-green-600 text-green-600 text-xs font-semibold px-2 py-1 rounded bg-green-50">
                          <Flag code={t.c} size="sm" />{t.n} ✓
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {!filled && (
                  <div className="px-4 py-2">
                    <div className="w-full py-2 bg-gray-100 text-gray-400 text-xs font-bold tracking-widest text-center rounded">
                      PREENCHA OS JOGOS PRIMEIRO
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {['r32', 'oitavas', 'quartas', 'semi'].map(st => stage === st && (
        <div key={st}>{renderBracketStage(st)}</div>
      ))}

      {stage === 'final' && (
        <div className="max-w-lg mx-auto">
          {!ta || !tb ? (
            <p className="text-gray-400 text-sm text-center">Complete a semifinal primeiro.</p>
          ) : champion ? (
            <div className="text-center py-10">
              <div className="w-24 h-24 rounded-full border-4 border-yellow-400 flex items-center justify-center text-5xl mx-auto mb-4 bg-yellow-50">🏆</div>
              <div className="text-yellow-400 text-2xl tracking-widest mb-3">★★★★★</div>
              <p className="text-xs font-bold tracking-widest text-gray-400 mb-3">SEU CAMPEÃO DO MUNDO</p>
              <div className="flex justify-center mb-3"><Flag code={champion.c} size="xl" /></div>
              <h2 className="font-black text-4xl tracking-widest mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{champion.n}</h2>
              <p className="text-green-600 text-sm font-semibold tracking-wider mb-8">Copa do Mundo 2026 — USA · CAN · MEX</p>
              {!confirmed && !locked && (
                <button onClick={handleConfirm} disabled={saving}
                  className="bg-green-600 text-white font-bold px-10 py-3 rounded-xl text-sm tracking-widest hover:bg-green-700 transition disabled:opacity-50">
                  {saving ? 'SALVANDO...' : 'CONFIRMAR MEU BOLÃO'}
                </button>
              )}
              {confirmed && <p className="text-green-600 font-semibold text-sm">✓ Bolão confirmado!</p>}
            </div>
          ) : (
            <div>
              <h2 className="font-black text-2xl tracking-widest mb-6 text-center" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>GRANDE FINAL</h2>
              <div className="bg-white border-2 border-yellow-400 rounded-xl p-6 flex items-center gap-4">
                <span className="flex items-center gap-2 flex-1 text-base font-bold"><Flag code={ta.c} />{ta.n}</span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <input type="number" min="0" max="20" value={finalS['0-a'] || ''}
                    onChange={e => setBScore('final', 0, 'a', e.target.value, ta, tb)}
                    className="w-12 h-10 text-center border-2 border-gray-200 rounded-lg text-lg font-black focus:outline-none focus:border-green-600" />
                  <span className="text-gray-300">×</span>
                  <input type="number" min="0" max="20" value={finalS['0-b'] || ''}
                    onChange={e => setBScore('final', 0, 'b', e.target.value, ta, tb)}
                    className="w-12 h-10 text-center border-2 border-gray-200 rounded-lg text-lg font-black focus:outline-none focus:border-green-600" />
                </div>
                <span className="flex items-center gap-2 flex-1 justify-end text-base font-bold">{tb.n}<Flag code={tb.c} /></span>
              </div>
              <p className="text-center text-xs text-gray-400 mt-3">Preencha o placar para revelar seu campeão</p>
            </div>
          )}
        </div>
      )}

      {penaltyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="text-3xl mb-2">🥅</div>
            <h3 className="font-black text-lg tracking-widest mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>PÊNALTIS!</h3>
            <p className="text-xs text-gray-400 mb-5">Empate no tempo normal — quem vence nos pênaltis?</p>
            <div className="flex flex-col gap-3">
              {[penaltyModal.ta, penaltyModal.tb].map(team => (
                <button key={team.n} onClick={() => confirmPenalty(team)}
                  className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 text-sm font-medium transition">
                  <Flag code={team.c} />{team.n}
                  <span className="ml-auto text-xs text-gray-400">vence nos pênaltis →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}