import { useState } from 'react'
 
type Team = {
  flag: string
  name: string
  fifa: number
  ataque: number
  defesa: number
  entrosamento: number
  valor_mercado: number
  experiencia_copa: number
  media_gols: number
  media_gols_sofridos: number
}
 
const TEAMS: Team[] = [
  { flag:'🇫🇷', name:'França',        fifa:1,  ataque:93, defesa:85, entrosamento:88, valor_mercado:98, experiencia_copa:88, media_gols:2.3, media_gols_sofridos:0.7 },
  { flag:'🇪🇸', name:'Espanha',       fifa:2,  ataque:90, defesa:83, entrosamento:90, valor_mercado:95, experiencia_copa:85, media_gols:2.2, media_gols_sofridos:0.8 },
  { flag:'🇦🇷', name:'Argentina',     fifa:3,  ataque:91, defesa:78, entrosamento:85, valor_mercado:90, experiencia_copa:95, media_gols:1.9, media_gols_sofridos:0.8 },
  { flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', name:'Inglaterra',    fifa:4,  ataque:88, defesa:80, entrosamento:78, valor_mercado:96, experiencia_copa:82, media_gols:2.0, media_gols_sofridos:0.9 },
  { flag:'🇵🇹', name:'Portugal',      fifa:5,  ataque:89, defesa:76, entrosamento:75, valor_mercado:92, experiencia_copa:78, media_gols:2.2, media_gols_sofridos:1.0 },
  { flag:'🇧🇷', name:'Brasil',        fifa:6,  ataque:86, defesa:78, entrosamento:70, valor_mercado:88, experiencia_copa:90, media_gols:2.1, media_gols_sofridos:0.9 },
  { flag:'🇳🇱', name:'Países Baixos', fifa:7,  ataque:86, defesa:80, entrosamento:78, valor_mercado:89, experiencia_copa:80, media_gols:1.9, media_gols_sofridos:0.9 },
  { flag:'🇲🇦', name:'Marrocos',      fifa:8,  ataque:78, defesa:85, entrosamento:80, valor_mercado:62, experiencia_copa:55, media_gols:1.4, media_gols_sofridos:0.7 },
  { flag:'🇧🇪', name:'Bélgica',       fifa:9,  ataque:84, defesa:77, entrosamento:72, valor_mercado:82, experiencia_copa:72, media_gols:1.8, media_gols_sofridos:1.0 },
  { flag:'🇩🇪', name:'Alemanha',      fifa:10, ataque:87, defesa:82, entrosamento:82, valor_mercado:91, experiencia_copa:95, media_gols:2.0, media_gols_sofridos:1.0 },
  { flag:'🇭🇷', name:'Croácia',       fifa:11, ataque:80, defesa:78, entrosamento:82, valor_mercado:68, experiencia_copa:70, media_gols:1.6, media_gols_sofridos:0.9 },
  { flag:'🇮🇹', name:'Itália',        fifa:12, ataque:80, defesa:83, entrosamento:80, valor_mercado:80, experiencia_copa:88, media_gols:1.5, media_gols_sofridos:0.8 },
  { flag:'🇨🇴', name:'Colômbia',      fifa:13, ataque:78, defesa:72, entrosamento:74, valor_mercado:65, experiencia_copa:62, media_gols:1.7, media_gols_sofridos:1.1 },
  { flag:'🇸🇳', name:'Senegal',       fifa:14, ataque:75, defesa:76, entrosamento:76, valor_mercado:58, experiencia_copa:48, media_gols:1.5, media_gols_sofridos:1.0 },
  { flag:'🇲🇽', name:'México',        fifa:15, ataque:74, defesa:72, entrosamento:76, valor_mercado:60, experiencia_copa:80, media_gols:1.6, media_gols_sofridos:1.2 },
  { flag:'🇺🇸', name:'EUA',           fifa:16, ataque:72, defesa:70, entrosamento:68, valor_mercado:58, experiencia_copa:65, media_gols:1.5, media_gols_sofridos:1.2 },
  { flag:'🇺🇾', name:'Uruguai',       fifa:17, ataque:76, defesa:74, entrosamento:74, valor_mercado:62, experiencia_copa:78, media_gols:1.5, media_gols_sofridos:1.0 },
  { flag:'🇯🇵', name:'Japão',         fifa:18, ataque:74, defesa:74, entrosamento:80, valor_mercado:55, experiencia_copa:62, media_gols:1.6, media_gols_sofridos:1.1 },
  { flag:'🇨🇭', name:'Suíça',         fifa:19, ataque:72, defesa:76, entrosamento:76, valor_mercado:60, experiencia_copa:68, media_gols:1.5, media_gols_sofridos:1.0 },
  { flag:'🇩🇰', name:'Dinamarca',     fifa:20, ataque:74, defesa:76, entrosamento:76, valor_mercado:64, experiencia_copa:60, media_gols:1.6, media_gols_sofridos:1.0 },
  { flag:'🇸🇪', name:'Suécia',        fifa:21, ataque:72, defesa:74, entrosamento:72, valor_mercado:58, experiencia_copa:72, media_gols:1.4, media_gols_sofridos:1.1 },
  { flag:'🇦🇹', name:'Áustria',       fifa:22, ataque:72, defesa:70, entrosamento:70, valor_mercado:56, experiencia_copa:45, media_gols:1.5, media_gols_sofridos:1.2 },
  { flag:'🇦🇺', name:'Austrália',     fifa:23, ataque:66, defesa:66, entrosamento:66, valor_mercado:42, experiencia_copa:55, media_gols:1.3, media_gols_sofridos:1.4 },
  { flag:'🇰🇷', name:'Coreia do Sul', fifa:24, ataque:72, defesa:68, entrosamento:70, valor_mercado:52, experiencia_copa:62, media_gols:1.5, media_gols_sofridos:1.3 },
  { flag:'🇪🇨', name:'Equador',       fifa:25, ataque:68, defesa:66, entrosamento:66, valor_mercado:44, experiencia_copa:42, media_gols:1.4, media_gols_sofridos:1.3 },
  { flag:'🇹🇷', name:'Turquia',       fifa:26, ataque:70, defesa:68, entrosamento:66, valor_mercado:50, experiencia_copa:48, media_gols:1.5, media_gols_sofridos:1.3 },
  { flag:'🇺🇦', name:'Ucrânia',       fifa:27, ataque:70, defesa:68, entrosamento:68, valor_mercado:50, experiencia_copa:30, media_gols:1.4, media_gols_sofridos:1.2 },
  { flag:'🇳🇴', name:'Noruega',       fifa:28, ataque:74, defesa:68, entrosamento:66, valor_mercado:62, experiencia_copa:30, media_gols:1.8, media_gols_sofridos:1.3 },
  { flag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', name:'Escócia',       fifa:29, ataque:64, defesa:66, entrosamento:68, valor_mercado:40, experiencia_copa:28, media_gols:1.3, media_gols_sofridos:1.3 },
  { flag:'🇨🇦', name:'Canadá',        fifa:30, ataque:68, defesa:66, entrosamento:64, valor_mercado:46, experiencia_copa:30, media_gols:1.4, media_gols_sofridos:1.3 },
  { flag:'🇮🇷', name:'Irã',           fifa:31, ataque:64, defesa:68, entrosamento:66, valor_mercado:32, experiencia_copa:52, media_gols:1.2, media_gols_sofridos:1.2 },
  { flag:'🇯🇴', name:'Jordânia',      fifa:32, ataque:56, defesa:58, entrosamento:58, valor_mercado:20, experiencia_copa:15, media_gols:1.0, media_gols_sofridos:1.6 },
  { flag:'🇵🇾', name:'Paraguai',      fifa:33, ataque:62, defesa:62, entrosamento:62, valor_mercado:34, experiencia_copa:55, media_gols:1.2, media_gols_sofridos:1.3 },
  { flag:'🇿🇦', name:'África do Sul', fifa:34, ataque:58, defesa:58, entrosamento:60, valor_mercado:28, experiencia_copa:42, media_gols:1.1, media_gols_sofridos:1.5 },
  { flag:'🇬🇭', name:'Gana',          fifa:35, ataque:62, defesa:58, entrosamento:60, valor_mercado:30, experiencia_copa:42, media_gols:1.2, media_gols_sofridos:1.5 },
  { flag:'🇨🇿', name:'Rep. Tcheca',   fifa:36, ataque:66, defesa:66, entrosamento:66, valor_mercado:44, experiencia_copa:52, media_gols:1.3, media_gols_sofridos:1.2 },
  { flag:'🇧🇦', name:'Bósnia-Herz.',  fifa:37, ataque:62, defesa:60, entrosamento:60, valor_mercado:32, experiencia_copa:18, media_gols:1.2, media_gols_sofridos:1.4 },
  { flag:'🇮🇶', name:'Iraque',        fifa:38, ataque:56, defesa:54, entrosamento:56, valor_mercado:18, experiencia_copa:22, media_gols:1.0, media_gols_sofridos:1.6 },
  { flag:'🇨🇻', name:'Cabo Verde',    fifa:39, ataque:56, defesa:56, entrosamento:58, valor_mercado:16, experiencia_copa:10, media_gols:1.0, media_gols_sofridos:1.5 },
  { flag:'🇹🇳', name:'Tunísia',       fifa:40, ataque:60, defesa:60, entrosamento:60, valor_mercado:26, experiencia_copa:45, media_gols:1.1, media_gols_sofridos:1.4 },
  { flag:'🇩🇿', name:'Argélia',       fifa:41, ataque:62, defesa:60, entrosamento:60, valor_mercado:30, experiencia_copa:42, media_gols:1.2, media_gols_sofridos:1.3 },
  { flag:'🇳🇿', name:'Nova Zelândia', fifa:42, ataque:52, defesa:52, entrosamento:54, valor_mercado:16, experiencia_copa:25, media_gols:0.9, media_gols_sofridos:1.8 },
  { flag:'🇶🇦', name:'Catar',         fifa:43, ataque:54, defesa:54, entrosamento:58, valor_mercado:20, experiencia_copa:18, media_gols:1.0, media_gols_sofridos:1.7 },
  { flag:'🇺🇿', name:'Uzbequistão',   fifa:44, ataque:46, defesa:44, entrosamento:42, valor_mercado:14, experiencia_copa:10, media_gols:1.0, media_gols_sofridos:1.8 },
  { flag:'🇨🇼', name:'Curaçao',       fifa:45, ataque:44, defesa:42, entrosamento:40, valor_mercado:10, experiencia_copa:10, media_gols:0.9, media_gols_sofridos:2.0 },
  { flag:'🇵🇦', name:'Panamá',        fifa:46, ataque:52, defesa:54, entrosamento:54, valor_mercado:16, experiencia_copa:20, media_gols:0.9, media_gols_sofridos:1.6 },
  { flag:'🇭🇹', name:'Haiti',         fifa:47, ataque:42, defesa:40, entrosamento:38, valor_mercado:12, experiencia_copa:15, media_gols:0.8, media_gols_sofridos:2.2 },
  { flag:'🇸🇦', name:'Arábia Saudita',fifa:48, ataque:54, defesa:52, entrosamento:54, valor_mercado:22, experiencia_copa:35, media_gols:1.0, media_gols_sofridos:1.7 },
]
 
type AttrDef = {
  key: keyof Team
  label: string
  weight: number
  checked: boolean
  max: number
  invert?: boolean
}
 
const ATTR_DEFS: AttrDef[] = [
  { key:'ataque',              label:'Ataque',             weight:0.22, checked:true, max:100 },
  { key:'defesa',              label:'Defesa',             weight:0.18, checked:true, max:100 },
  { key:'entrosamento',        label:'Entrosamento',       weight:0.13, checked:true, max:100 },
  { key:'experiencia_copa',    label:'Exp. Copa',          weight:0.15, checked:true, max:100 },
  { key:'valor_mercado',       label:'Valor de mercado',   weight:0.12, checked:true, max:100 },
  { key:'media_gols',          label:'Méd. gols marcados', weight:0.10, checked:true, max:3.5 },
  { key:'media_gols_sofridos', label:'Méd. gols sofridos', weight:0.10, checked:true, max:3.5, invert:true },
]
 
function normalize(val: number, attr: AttrDef): number {
  if (attr.invert) return Math.max(0, Math.round((1 - val / attr.max) * 100))
  return Math.round((val / attr.max) * 100)
}
 
function getScore(team: Team, attrs: AttrDef[]): number {
  const active = attrs.filter(a => a.checked)
  if (!active.length) return 0.5
  const totalW = active.reduce((s, a) => s + a.weight, 0)
  return active.reduce((s, a) => s + (normalize(team[a.key] as number, a) / 100) * (a.weight / totalW), 0)
}
 
 
export default function WarRoom() {
  const [idxA, setIdxA] = useState(5) // Brasil
  const [idxB, setIdxB] = useState(0) // França
  const [attrs, setAttrs] = useState<AttrDef[]>(ATTR_DEFS.map(a => ({ ...a })))
  const [result, setResult] = useState<{ gA: number; gB: number; sA: number; sB: number } | null>(null)
 
  const teamA = TEAMS[idxA]
  const teamB = TEAMS[idxB]
 
  const toggleAttr = (i: number) => {
    const next = attrs.map((a, j) => j === i ? { ...a, checked: !a.checked } : a)
    setAttrs(next)
    setResult(null)
  }
 
  const simulate = () => {
    const sA = getScore(teamA, attrs)
    const sB = getScore(teamB, attrs)
    const total = sA + sB
    const relA = sA / total
 
    const strongest = Math.max(sA, sB)
    const goalsTotal = 2 + Math.round(strongest * 3)
 
    let gA = Math.round(goalsTotal * relA)
    let gB = goalsTotal - gA
 
    if (relA > 0.65) gB = Math.max(0, gB - 1)
    if (relA > 0.75) gB = 0
    if (relA < 0.35) gA = Math.max(0, gA - 1)
    if (relA < 0.25) gA = 0
 
    const diff = Math.abs(sA - sB)
    if (gA === gB && diff > 0.01) {
      if (sA > sB) gA += 1
      else gB += 1
    }
 
    setResult({ gA, gB, sA, sB })
  }
 
  const renderBars = (team: Team, other: Team) =>
    attrs.map((a, i) => {
      const val = normalize(team[a.key] as number, a)
      const valO = normalize(other[a.key] as number, a)
      const isWin = val >= valO
      const color = isWin ? '#1D9E75' : '#888780'
      const display = a.max === 100 ? String(team[a.key]) : (team[a.key] as number).toFixed(1)
      return (
        <div key={i} className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-400 w-28 flex-shrink-0">{a.label}</span>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${val}%`, background: color }} />
          </div>
          <span className="text-xs font-semibold text-gray-700 w-8 text-right">{display}</span>
        </div>
      )
    })
 
  const sA = result?.sA ?? getScore(teamA, attrs)
  const sB = result?.sB ?? getScore(teamB, attrs)
  const total = sA + sB
  const diff = Math.abs(sA - sB)
  const pD = Math.min(8, Math.round(8 * (1 - diff * 8)))
  const pA = Math.round((sA / total) * (100 - pD))
  const pB = Math.max(0, 100 - pA - pD)
  const confidence = diff < 0.03 ? 'Jogo equilibrado' : diff < 0.08 ? 'Leve vantagem para' : 'Favorito:'
  const winner = sA >= sB ? teamA : teamB
 
  return (
    <div>
      <h1 className="font-black text-3xl tracking-widest mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>WAR ROOM</h1>
      <p className="text-gray-400 text-sm mb-8">Simule confrontos e analise os dados antes de apostar ⚔️</p>
 
      {/* Seletores */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs font-bold tracking-widest text-gray-500 mb-1 block">TIME A</label>
          <select
            value={idxA}
            onChange={e => { setIdxA(Number(e.target.value)); setResult(null) }}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-green-600"
          >
            {TEAMS.map((t, i) => <option key={i} value={i}>{t.flag} {t.name} (#{t.fifa})</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold tracking-widest text-gray-500 mb-1 block">TIME B</label>
          <select
            value={idxB}
            onChange={e => { setIdxB(Number(e.target.value)); setResult(null) }}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-green-600"
          >
            {TEAMS.map((t, i) => <option key={i} value={i}>{t.flag} {t.name} (#{t.fifa})</option>)}
          </select>
        </div>
      </div>
 
      {/* Cards comparação */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-lg font-bold mb-1">{teamA.flag} {teamA.name}</div>
          <div className="text-xs text-gray-400 mb-4">Ranking FIFA <span className="font-bold text-black">#{teamA.fifa}</span></div>
          {renderBars(teamA, teamB)}
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-lg font-bold mb-1">{teamB.flag} {teamB.name}</div>
          <div className="text-xs text-gray-400 mb-4">Ranking FIFA <span className="font-bold text-black">#{teamB.fifa}</span></div>
          {renderBars(teamB, teamA)}
        </div>
      </div>
 
      {/* Atributos */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <p className="text-xs font-bold tracking-widest text-gray-500 mb-3">ATRIBUTOS COMPARADOS</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {attrs.map((a, i) => (
            <label key={i} className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={a.checked}
                onChange={() => toggleAttr(i)}
                className="w-3.5 h-3.5"
              />
              {a.label}
            </label>
          ))}
        </div>
      </div>
 
      {/* Botão simular */}
      <button
        onClick={simulate}
        className="w-full bg-black text-yellow-400 font-black tracking-widest py-3 rounded-xl text-sm hover:bg-gray-900 transition mb-4"
        style={{ fontFamily: 'Bebas Neue, sans-serif' }}
      >
        ⚔️ SIMULAR CONFRONTO
      </button>
 
      {/* Resultado */}
      {result && (
        <div className="bg-white border-2 border-yellow-400 rounded-xl p-6 text-center">
          <p className="text-xs font-bold tracking-widest text-gray-400 mb-2">PLACAR SIMULADO</p>
          <div className="font-black text-5xl tracking-widest mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            {result.gA} – {result.gB}
          </div>
          <p className="text-sm text-gray-500 mb-1">{confidence}</p>
          <p className="text-base font-bold mb-4">{winner.flag} {winner.name}</p>
 
          {/* Barra de probabilidade */}
          <div className="flex rounded-full overflow-hidden h-3 mb-2">
            <div style={{ width: `${pA}%`, background: '#1D9E75' }} />
            <div style={{ width: `${pD}%`, background: '#888780' }} />
            <div style={{ width: `${pB}%`, background: '#378ADD' }} />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{teamA.flag} {pA}% vitória</span>
            <span>{pD}% empate</span>
            <span>{pB}% vitória {teamB.flag}</span>
          </div>
 
          <p className="text-xs text-gray-300 mt-4">
            Baseado em {attrs.filter(a => a.checked).length} atributo{attrs.filter(a => a.checked).length > 1 ? 's' : ''} selecionado{attrs.filter(a => a.checked).length > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  )
}