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
  { flag:'🇨🇴', name:'Colômbia',      fifa:13, ataque:78, defesa:72, entrosamento:74, valor_mercado:65, experiencia_copa:62, media_gols:1.7, media_gols_sofridos:1.1 },
  { flag:'🇸🇳', name:'Senegal',       fifa:14, ataque:75, defesa:76, entrosamento:76, valor_mercado:58, experiencia_copa:48, media_gols:1.5, media_gols_sofridos:1.0 },
  { flag:'🇲🇽', name:'México',        fifa:15, ataque:74, defesa:72, entrosamento:76, valor_mercado:60, experiencia_copa:80, media_gols:1.6, media_gols_sofridos:1.2 },
  { flag:'🇺🇸', name:'EUA',           fifa:16, ataque:72, defesa:70, entrosamento:68, valor_mercado:58, experiencia_copa:65, media_gols:1.5, media_gols_sofridos:1.2 },
  { flag:'🇺🇾', name:'Uruguai',       fifa:17, ataque:76, defesa:74, entrosamento:74, valor_mercado:62, experiencia_copa:78, media_gols:1.5, media_gols_sofridos:1.0 },
  { flag:'🇯🇵', name:'Japão',         fifa:20, ataque:74, defesa:74, entrosamento:80, valor_mercado:55, experiencia_copa:62, media_gols:1.6, media_gols_sofridos:1.1 },
  { flag:'🇨🇭', name:'Suíça',         fifa:22, ataque:72, defesa:76, entrosamento:76, valor_mercado:60, experiencia_copa:68, media_gols:1.5, media_gols_sofridos:1.0 },
  { flag:'🇰🇷', name:'Coreia do Sul', fifa:23, ataque:72, defesa:68, entrosamento:70, valor_mercado:52, experiencia_copa:62, media_gols:1.5, media_gols_sofridos:1.3 },
  { flag:'🇸🇪', name:'Suécia',        fifa:25, ataque:72, defesa:74, entrosamento:72, valor_mercado:58, experiencia_copa:72, media_gols:1.4, media_gols_sofridos:1.1 },
  { flag:'🇦🇺', name:'Austrália',     fifa:25, ataque:66, defesa:66, entrosamento:66, valor_mercado:42, experiencia_copa:55, media_gols:1.3, media_gols_sofridos:1.4 },
  { flag:'🇪🇨', name:'Equador',       fifa:30, ataque:68, defesa:66, entrosamento:66, valor_mercado:44, experiencia_copa:42, media_gols:1.4, media_gols_sofridos:1.3 },
  { flag:'🇹🇷', name:'Turquia',       fifa:32, ataque:70, defesa:68, entrosamento:66, valor_mercado:50, experiencia_copa:48, media_gols:1.5, media_gols_sofridos:1.3 },
  { flag:'🇨🇿', name:'Rep. Tcheca',   fifa:35, ataque:66, defesa:66, entrosamento:66, valor_mercado:44, experiencia_copa:52, media_gols:1.3, media_gols_sofridos:1.2 },
  { flag:'🇳🇴', name:'Noruega',       fifa:36, ataque:74, defesa:68, entrosamento:66, valor_mercado:62, experiencia_copa:30, media_gols:1.8, media_gols_sofridos:1.3 },
  { flag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', name:'Escócia',       fifa:38, ataque:64, defesa:66, entrosamento:68, valor_mercado:40, experiencia_copa:28, media_gols:1.3, media_gols_sofridos:1.3 },
  { flag:'🇮🇷', name:'Irã',           fifa:40, ataque:64, defesa:68, entrosamento:66, valor_mercado:32, experiencia_copa:52, media_gols:1.2, media_gols_sofridos:1.2 },
  { flag:'🇨🇮', name:'Costa do Marfim', fifa:42, ataque:68, defesa:62, entrosamento:64, valor_mercado:44, experiencia_copa:42, media_gols:1.4, media_gols_sofridos:1.4 },
  { flag:'🇪🇬', name:'Egito',         fifa:44, ataque:62, defesa:64, entrosamento:64, valor_mercado:30, experiencia_copa:38, media_gols:1.2, media_gols_sofridos:1.3 },
  { flag:'🇦🇹', name:'Áustria',       fifa:46, ataque:72, defesa:70, entrosamento:70, valor_mercado:56, experiencia_copa:45, media_gols:1.5, media_gols_sofridos:1.2 },
  { flag:'🇨🇦', name:'Canadá',        fifa:48, ataque:68, defesa:66, entrosamento:64, valor_mercado:46, experiencia_copa:30, media_gols:1.4, media_gols_sofridos:1.3 },
  { flag:'🇩🇿', name:'Argélia',       fifa:50, ataque:62, defesa:60, entrosamento:60, valor_mercado:30, experiencia_copa:42, media_gols:1.2, media_gols_sofridos:1.3 },
  { flag:'🇹🇳', name:'Tunísia',       fifa:52, ataque:60, defesa:60, entrosamento:60, valor_mercado:26, experiencia_copa:45, media_gols:1.1, media_gols_sofridos:1.4 },
  { flag:'🇸🇦', name:'Arábia Saudita',fifa:55, ataque:54, defesa:52, entrosamento:54, valor_mercado:22, experiencia_copa:35, media_gols:1.0, media_gols_sofridos:1.7 },
  { flag:'🇬🇭', name:'Gana',          fifa:58, ataque:62, defesa:58, entrosamento:60, valor_mercado:30, experiencia_copa:42, media_gols:1.2, media_gols_sofridos:1.5 },
  { flag:'🇵🇾', name:'Paraguai',      fifa:60, ataque:62, defesa:62, entrosamento:62, valor_mercado:34, experiencia_copa:55, media_gols:1.2, media_gols_sofridos:1.3 },
  { flag:'🇿🇦', name:'África do Sul', fifa:62, ataque:58, defesa:58, entrosamento:60, valor_mercado:28, experiencia_copa:42, media_gols:1.1, media_gols_sofridos:1.5 },
  { flag:'🇨🇻', name:'Cabo Verde',    fifa:70, ataque:56, defesa:56, entrosamento:58, valor_mercado:16, experiencia_copa:10, media_gols:1.0, media_gols_sofridos:1.5 },
  { flag:'🇧🇦', name:'Bósnia-Herz.',  fifa:72, ataque:62, defesa:60, entrosamento:60, valor_mercado:32, experiencia_copa:18, media_gols:1.2, media_gols_sofridos:1.4 },
  { flag:'🇯🇴', name:'Jordânia',      fifa:80, ataque:56, defesa:58, entrosamento:58, valor_mercado:20, experiencia_copa:15, media_gols:1.0, media_gols_sofridos:1.6 },
  { flag:'🇮🇶', name:'Iraque',        fifa:82, ataque:56, defesa:54, entrosamento:56, valor_mercado:18, experiencia_copa:22, media_gols:1.0, media_gols_sofridos:1.6 },
  { flag:'🇺🇿', name:'Uzbequistão',   fifa:85, ataque:46, defesa:44, entrosamento:42, valor_mercado:14, experiencia_copa:10, media_gols:1.0, media_gols_sofridos:1.8 },
  { flag:'🇶🇦', name:'Catar',         fifa:88, ataque:54, defesa:54, entrosamento:58, valor_mercado:20, experiencia_copa:18, media_gols:1.0, media_gols_sofridos:1.7 },
  { flag:'🇨🇩', name:'Congo (RD)',    fifa:92, ataque:54, defesa:52, entrosamento:52, valor_mercado:16, experiencia_copa:12, media_gols:0.9, media_gols_sofridos:1.8 },
  { flag:'🇵🇦', name:'Panamá',        fifa:95, ataque:52, defesa:54, entrosamento:54, valor_mercado:16, experiencia_copa:20, media_gols:0.9, media_gols_sofridos:1.6 },
  { flag:'🇳🇿', name:'Nova Zelândia', fifa:98, ataque:52, defesa:52, entrosamento:54, valor_mercado:16, experiencia_copa:25, media_gols:0.9, media_gols_sofridos:1.8 },
  { flag:'🇨🇼', name:'Curaçao',       fifa:105, ataque:44, defesa:42, entrosamento:40, valor_mercado:10, experiencia_copa:10, media_gols:0.9, media_gols_sofridos:2.0 },
  { flag:'🇭🇹', name:'Haiti',         fifa:115, ataque:42, defesa:40, entrosamento:38, valor_mercado:12, experiencia_copa:15, media_gols:0.8, media_gols_sofridos:2.2 },
]
 
const CRAQUES = [
  { n:'Mbappé',     flag:'🇫🇷', selecao:'França',     data:{2019:0.52,2020:0.58,2021:0.62,2022:0.71,2023:0.75,2024:0.78,2025:0.82} as Record<number,number> },
  { n:'Vinicius Jr',flag:'🇧🇷', selecao:'Brasil',     data:{2019:0.28,2020:0.35,2021:0.48,2022:0.55,2023:0.62,2024:0.68,2025:0.72} as Record<number,number> },
  { n:'Haaland',    flag:'🇳🇴', selecao:'Noruega',    data:{2019:0.72,2020:0.85,2021:0.92,2022:0.88,2023:0.95,2024:0.98,2025:1.02} as Record<number,number> },
  { n:'Messi',      flag:'🇦🇷', selecao:'Argentina',  data:{2019:0.65,2020:0.68,2021:0.72,2022:0.78,2023:0.65,2024:0.60,2025:0.55} as Record<number,number> },
  { n:'CR7',        flag:'🇵🇹', selecao:'Portugal',   data:{2019:0.70,2020:0.68,2021:0.65,2022:0.62,2023:0.55,2024:0.50,2025:0.45} as Record<number,number> },
  { n:'Neymar',     flag:'🇧🇷', selecao:'Brasil',     data:{2019:0.62,2020:0.58,2021:0.52,2022:0.48,2023:0.32,2024:0.25,2025:0.30} as Record<number,number> },
  { n:'Endrick',    flag:'🇧🇷', selecao:'Brasil',     data:{2019:0,2020:0,2021:0,2022:0.15,2023:0.28,2024:0.42,2025:0.52} as Record<number,number> },
  { n:'Bellingham', flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', selecao:'Inglaterra', data:{2019:0.08,2020:0.12,2021:0.22,2022:0.32,2023:0.45,2024:0.52,2025:0.58} },
  { n:'Lamine Yamal',flag:'🇪🇸', selecao:'Espanha',  data:{2019:0,2020:0,2021:0,2022:0,2023:0.28,2024:0.45,2025:0.55} as Record<number,number> },
  { n:'Modric',     flag:'🇭🇷', selecao:'Croácia',    data:{2019:0.22,2020:0.20,2021:0.18,2022:0.20,2023:0.15,2024:0.12,2025:0.10} as Record<number,number> },
  { n:'Salah',      flag:'🇪🇬', selecao:'Egito',      data:{2019:0.68,2020:0.65,2021:0.70,2022:0.72,2023:0.68,2024:0.62,2025:0.58} as Record<number,number> },
]
 
const YEARS = [2019,2020,2021,2022,2023,2024,2025]
const COLORS = ['#1D9E75','#378ADD','#D85A30','#7F77DD','#BA7517','#D4537E']
 
type AttrDef = { key: keyof Team; label: string; max: number; invert?: boolean; checked: boolean }
 
const ATTR_DEFS: AttrDef[] = [
  { key:'ataque',              label:'Ataque',             max:100,  checked:true },
  { key:'defesa',              label:'Defesa',             max:100,  checked:true },
  { key:'entrosamento',        label:'Entrosamento',       max:100,  checked:true },
  { key:'experiencia_copa',    label:'Exp. Copa',          max:100,  checked:true },
  { key:'valor_mercado',       label:'Valor de mercado',   max:100,  checked:true },
  { key:'media_gols',          label:'Média gols marcados',max:3.5,  checked:true },
  { key:'media_gols_sofridos', label:'Média gols sofridos',max:3.5,  checked:true, invert:true },
]
 
function normalize(val: number, attr: AttrDef): number {
  if (attr.invert) return Math.max(0, Math.round((1 - val / attr.max) * 100))
  return Math.round((val / attr.max) * 100)
}
 
function getScore(team: Team, attrs: AttrDef[]): number {
  const active = attrs.filter(a => a.checked)
  if (!active.length) return 0.5
  const totalW = active.length
  return active.reduce((s, a) => s + (normalize(team[a.key] as number, a) / 100) * (1 / totalW), 0)
}
 
function BarRow({ label, val, valOther, rawVal, max }: { label: string; val: number; valOther: number; rawVal: number; max: number }) {
  const isWin = val >= valOther
  const color = isWin ? '#1D9E75' : '#888780'
  const display = max === 100 ? String(rawVal) : rawVal.toFixed(1)
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xs text-gray-400 w-28 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${val}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-8 text-right">{display}</span>
    </div>
  )
}
 
export default function WarRoom() {
  const [activeTab, setActiveTab] = useState<'comparar' | 'simular' | 'craques'>('comparar')
 
  // Comparar times
  const [selectedTeams, setSelectedTeams] = useState<string[]>(TEAMS.slice(0,10).map(t=>t.name))
  const [selectedAttr, setSelectedAttr] = useState<keyof Team>('ataque')
 
  // Simulador
  const [idxA, setIdxA] = useState(5) // Brasil
  const [idxB, setIdxB] = useState(0) // França
  const [attrs, setAttrs] = useState<AttrDef[]>(ATTR_DEFS.map(a => ({ ...a })))
  const [result, setResult] = useState<{ gA: number; gB: number; sA: number; sB: number } | null>(null)
 
  // Craques
  const [selectedCraques, setSelectedCraques] = useState<string[]>(['Mbappé', 'Haaland', 'Vinicius Jr'])
 
  const toggleCraque = (name: string) => {
    setSelectedCraques(prev =>
      prev.includes(name) ? (prev.length > 1 ? prev.filter(n => n !== name) : prev) : [...prev, name]
    )
  }
 
  const toggleAttr = (i: number) => {
    setAttrs(prev => prev.map((a, j) => j === i ? { ...a, checked: !a.checked } : a))
    setResult(null)
  }
 
  const simulate = () => {
    const teamA = TEAMS[idxA], teamB = TEAMS[idxB]
    const sA = getScore(teamA, attrs), sB = getScore(teamB, attrs)
    const total = sA + sB, relA = sA / total
    const strongest = Math.max(sA, sB)
    const goalsTotal = 2 + Math.round(strongest * 3)
    let gA = Math.round(goalsTotal * relA), gB = goalsTotal - gA
    if (relA > 0.65) gB = Math.max(0, gB - 1)
    if (relA > 0.75) gB = 0
    if (relA < 0.35) gA = Math.max(0, gA - 1)
    if (relA < 0.25) gA = 0
    const diff = Math.abs(sA - sB)
    if (gA === gB && diff > 0.01) { if (sA > sB) gA++; else gB++ }
    setResult({ gA, gB, sA, sB })
  }
 
  const teamA = TEAMS[idxA], teamB = TEAMS[idxB]
  const sA = result?.sA ?? 0, sB = result?.sB ?? 0
  const total = sA + sB || 1
  const diff = Math.abs(sA - sB)
  const pD = Math.max(0, Math.min(8, Math.round(8 * (1 - diff * 8))))
  const pA = Math.round((sA / total) * (100 - pD))
  const pB = Math.max(0, 100 - pA - pD)
  const winner = sA >= sB ? teamA : teamB
  const confidence = diff < 0.03 ? 'Jogo equilibrado' : diff < 0.08 ? 'Leve vantagem para' : 'Favorito:'
 
  // Chart data para craques (SVG simples)
  const craquesData = CRAQUES.filter(c => selectedCraques.includes(c.n))
  const maxVal = 1.2
  const chartH = 180, chartW = 500, padL = 40, padR = 10, padT = 10, padB = 30
  const innerW = chartW - padL - padR, innerH = chartH - padT - padB
  const xStep = innerW / (YEARS.length - 1)
  const yScale = (v: number) => padT + innerH - (v / maxVal) * innerH
 
  return (
    <div>
      <h1 className="font-black text-3xl tracking-widest mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>ANÁLISES</h1>
      <p className="text-gray-400 text-sm mb-6">Explore dados dos times e craques para fazer apostas mais estratégicas ⚔️</p>
 
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { id: 'comparar', label: '📊 COMPARAR TIMES' },
          { id: 'simular',  label: '⚔️ SIMULADOR' },
          { id: 'craques',  label: '⭐ CRAQUES' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-3 text-xs font-semibold tracking-widest border-b-2 transition whitespace-nowrap ${
              activeTab === tab.id ? 'border-yellow-400 text-black' : 'border-transparent text-gray-400 hover:text-black'
            }`}>{tab.label}</button>
        ))}
      </div>
 
      {/* COMPARAR TIMES */}
      {activeTab === 'comparar' && (
        <div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-xs font-bold tracking-widest text-gray-500 mb-1 block">ATRIBUTO</label>
              <select
                value={selectedAttr}
                onChange={e => setSelectedAttr(e.target.value as keyof Team)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-green-600">
                {ATTR_DEFS.map(a => <option key={String(a.key)} value={String(a.key)}>{a.label}</option>)}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold tracking-widest text-gray-500">TIMES</label>
                <button
                  onClick={() => setSelectedTeams(prev => prev.length === TEAMS.length ? TEAMS.slice(0,10).map(t=>t.name) : TEAMS.map(t=>t.name))}
                  className="text-xs text-green-600 font-semibold hover:underline">
                  {selectedTeams.length === TEAMS.length ? 'Desmarcar todos' : 'Selecionar todos'}
                </button>
              </div>
              <div className="border border-gray-200 rounded-xl p-2 max-h-52 overflow-y-auto">
                {TEAMS.map(t => (
                  <label key={t.name} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTeams.includes(t.name)}
                      onChange={() => setSelectedTeams(prev =>
                        prev.includes(t.name)
                          ? prev.length > 1 ? prev.filter(n => n !== t.name) : prev
                          : [...prev, t.name]
                      )}
                      className="w-3.5 h-3.5 flex-shrink-0"
                    />
                    <span className="text-xs">{t.flag} {t.name}</span>
                    <span className="text-xs text-gray-400 ml-auto">#{t.fifa}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
 
          {(() => {
            const attr = ATTR_DEFS.find(a => String(a.key) === String(selectedAttr))!
            const sorted = TEAMS.filter(t => selectedTeams.includes(t.name))
              .sort((a, b) => (b[selectedAttr] as number) - (a[selectedAttr] as number))
            const maxVal = sorted[0] ? (sorted[0][selectedAttr] as number) : 1
            return (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-xs font-bold tracking-widest text-gray-500 mb-4">{attr?.label?.toUpperCase()} — {sorted.length} times</p>
                <div className="flex flex-col gap-2">
                  {sorted.map((t, i) => {
                    const val = t[selectedAttr] as number
                    const pct = (val / maxVal) * 100
                    const color = pct > 85 ? '#1D9E75' : pct > 65 ? '#378ADD' : pct > 45 ? '#BA7517' : '#888780'
                    const display = attr.max === 100 ? String(val) : val.toFixed(1)
                    return (
                      <div key={t.name} className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 w-5 text-right flex-shrink-0">{i+1}</span>
                        <span className="text-xs flex-shrink-0 w-36 truncate">{t.flag} {t.name}</span>
                        <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                          <div className="h-full rounded transition-all flex items-center px-2"
                            style={{ width: `${pct}%`, background: color }}>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-700 w-8 text-right flex-shrink-0">{display}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}
        </div>
      )}
 
      {/* SIMULADOR */}
      {activeTab === 'simular' && (
        <div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-xs font-bold tracking-widest text-gray-500 mb-1 block">TIME A</label>
              <select value={idxA} onChange={e => { setIdxA(Number(e.target.value)); setResult(null) }}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-green-600">
                {TEAMS.map((t, i) => <option key={i} value={i}>{t.flag} {t.name} (#{t.fifa})</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold tracking-widest text-gray-500 mb-1 block">TIME B</label>
              <select value={idxB} onChange={e => { setIdxB(Number(e.target.value)); setResult(null) }}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-green-600">
                {TEAMS.map((t, i) => <option key={i} value={i}>{t.flag} {t.name} (#{t.fifa})</option>)}
              </select>
            </div>
          </div>
 
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[teamA, teamB].map((team, side) => {
              const other = side === 0 ? teamB : teamA
              return (
                <div key={side} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="text-base font-bold mb-1">{team.flag} {team.name}</div>
                  <div className="text-xs text-gray-400 mb-4">Ranking FIFA <span className="font-bold text-black">#{team.fifa}</span></div>
                  {attrs.map((a, i) => (
                    <BarRow key={i} label={a.label}
                      val={normalize(team[a.key] as number, a)}
                      valOther={normalize(other[a.key] as number, a)}
                      rawVal={team[a.key] as number} max={a.max} />
                  ))}
                </div>
              )
            })}
          </div>
 
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <p className="text-xs font-bold tracking-widest text-gray-500 mb-3">ATRIBUTOS COMPARADOS</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {attrs.map((a, i) => (
                <label key={i} className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={a.checked} onChange={() => toggleAttr(i)} className="w-3.5 h-3.5" />
                  {a.label}
                </label>
              ))}
            </div>
          </div>
 
          <button onClick={simulate}
            className="w-full bg-black text-yellow-400 font-black tracking-widest py-3 rounded-xl text-sm hover:bg-gray-900 transition mb-4"
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            ⚔️ SIMULAR CONFRONTO
          </button>
 
          {result && (
            <div className="bg-white border-2 border-yellow-400 rounded-xl p-6 text-center">
              <p className="text-xs font-bold tracking-widest text-gray-400 mb-2">PLACAR SIMULADO</p>
              <div className="font-black text-5xl tracking-widest mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                {result.gA} – {result.gB}
              </div>
              <p className="text-sm text-gray-500 mb-1">{confidence}</p>
              <p className="text-base font-bold mb-4">{winner.flag} {winner.name}</p>
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
              <p className="text-xs text-gray-300 mt-4">Baseado em {attrs.filter(a => a.checked).length} atributo{attrs.filter(a => a.checked).length > 1 ? 's' : ''}</p>
            </div>
          )}
        </div>
      )}
 
      {/* CRAQUES */}
      {activeTab === 'craques' && (
        <div>
          <p className="text-xs text-gray-400 mb-3">Selecione craques para comparar a evolução da média de gols por jogo.</p>
          <div className="flex flex-wrap gap-1.5 mb-6">
            {CRAQUES.map(c => (
              <button key={c.n} onClick={() => toggleCraque(c.n)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition ${
                  selectedCraques.includes(c.n)
                    ? 'bg-black text-yellow-400 border-black'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}>
                {c.flag} {c.n}
              </button>
            ))}
          </div>
 
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex flex-wrap gap-4 mb-4">
              {craquesData.map((c, i) => (
                <span key={c.n} className="flex items-center gap-1.5 text-xs font-medium">
                  <span className="inline-block w-4 h-0.5" style={{ background: COLORS[i % COLORS.length] }} />
                  {c.flag} {c.n}
                </span>
              ))}
            </div>
            <div style={{ overflowX: 'auto' }}>
              <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: '100%', minWidth: 300 }}>
                {/* Grid lines */}
                {[0, 0.3, 0.6, 0.9, 1.2].map(v => (
                  <g key={v}>
                    <line x1={padL} y1={yScale(v)} x2={chartW - padR} y2={yScale(v)} stroke="#f0f0f0" strokeWidth="1" />
                    <text x={padL - 4} y={yScale(v) + 3} fontSize="9" fill="#aaa" textAnchor="end">{v.toFixed(1)}</text>
                  </g>
                ))}
                {/* X axis labels */}
                {YEARS.map((y, i) => (
                  <text key={y} x={padL + i * xStep} y={chartH - 8} fontSize="9" fill="#aaa" textAnchor="middle">{y}</text>
                ))}
                {/* Lines */}
                {craquesData.map((c, ci) => {
                  const color = COLORS[ci % COLORS.length]
                  const points = YEARS.map((y, i) => `${padL + i * xStep},${yScale(c.data[y] || 0)}`).join(' ')
                  return (
                    <g key={c.n}>
                      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
                      {YEARS.map((y, i) => (
                        <circle key={y} cx={padL + i * xStep} cy={yScale(c.data[y] || 0)} r="3" fill={color} />
                      ))}
                    </g>
                  )
                })}
              </svg>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">Média de gols por jogo (seleções nacionais)</p>
          </div>
        </div>
      )}
    </div>
  )
}
