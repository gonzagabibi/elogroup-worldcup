import { useState } from 'react'
function Flag({ code }: { code: string }) {
  return <span className={`fi fi-${code} rounded-sm`} style={{ fontSize: '1.2rem', lineHeight: 1 }}></span>
}

// Ranking FIFA oficial abril 2026
const FIFA_RANKINGS: Record<string, number> = {
  'França': 1, 'Espanha': 2, 'Argentina': 3, 'Inglaterra': 4, 'Portugal': 5,
  'Brasil': 6, 'Países Baixos': 7, 'Marrocos': 8, 'Bélgica': 9, 'Alemanha': 10,
  'Croácia': 11, 'Colômbia': 13, 'Senegal': 14, 'México': 15, 'EUA': 16,
  'Uruguai': 17, 'Japão': 20, 'Suíça': 22, 'Coreia do Sul': 23, 'Suécia': 25,
  'Austrália': 25, 'Equador': 30, 'Turquia': 32, 'Rep. Tcheca': 35,
  'Noruega': 36, 'Escócia': 38, 'Irã': 40, 'Costa do Marfim': 42,
  'Egito': 44, 'Áustria': 46, 'Canadá': 48, 'Argélia': 50, 'Tunísia': 52,
  'Arábia Saudita': 55, 'Gana': 58, 'Paraguai': 60, 'África do Sul': 62,
  'Cabo Verde': 70, 'Bósnia-Herz.': 72, 'Jordânia': 80, 'Iraque': 82,
  'Uzbequistão': 85, 'Catar': 88, 'Congo (RD)': 92, 'Panamá': 95,
  'Nova Zelândia': 98, 'Curaçao': 105, 'Haiti': 115,
}

const RULES = [
  { stage: 'Fase de Grupos', icon: '⚽', color: 'bg-blue-50 border-blue-200', titleColor: 'text-blue-700',
    rules: [
      { desc: 'Acertar o placar exato', pts: 5 },
      { desc: 'Acertar apenas o vencedor ou empate', pts: 2 },
    ]},
  { stage: 'Rodada de 32', icon: '🏟️', color: 'bg-purple-50 border-purple-200', titleColor: 'text-purple-700',
    rules: [
      { desc: 'Acertar o placar exato', pts: 6 },
      { desc: 'Acertar o vencedor (incluindo pênaltis)', pts: 3 },
      { desc: 'Time classificado correto', pts: 3 },
    ]},
  { stage: 'Oitavas de Final', icon: '⚡', color: 'bg-orange-50 border-orange-200', titleColor: 'text-orange-700',
    rules: [
      { desc: 'Acertar o placar exato', pts: 8 },
      { desc: 'Acertar o vencedor (incluindo pênaltis)', pts: 4 },
      { desc: 'Time classificado correto', pts: 5 },
    ]},
  { stage: 'Quartas de Final', icon: '🔥', color: 'bg-red-50 border-red-200', titleColor: 'text-red-700',
    rules: [
      { desc: 'Acertar o placar exato', pts: 10 },
      { desc: 'Acertar o vencedor (incluindo pênaltis)', pts: 5 },
      { desc: 'Time classificado correto', pts: 7 },
    ]},
  { stage: 'Semifinal', icon: '💥', color: 'bg-yellow-50 border-yellow-200', titleColor: 'text-yellow-700',
    rules: [
      { desc: 'Acertar o placar exato', pts: 13 },
      { desc: 'Acertar o vencedor (incluindo pênaltis)', pts: 6 },
      { desc: 'Time classificado correto', pts: 10 },
    ]},
  { stage: 'Final', icon: '🏆', color: 'bg-green-50 border-green-200', titleColor: 'text-green-700',
    rules: [
      { desc: 'Acertar o placar exato da final', pts: 18 },
      { desc: 'Acertar o vencedor (incluindo pênaltis)', pts: 8 },
      { desc: 'Time classificado correto', pts: 15 },
      { desc: '⭐ Acertar o campeão do mundo', pts: 12 },
    ]},
]

const CATEGORIES = [
  { label: '🦅 Olho de Águia', desc: 'Top 5% do ranking', color: 'bg-yellow-400 text-black' },
  { label: '🏆 Craque do Sofá', desc: 'Top 20% do ranking', color: 'bg-green-600 text-white' },
  { label: '⚽ Torcedor Raiz', desc: 'Top 50% do ranking', color: 'bg-blue-500 text-white' },
  { label: '🎲 Chute no Escuro', desc: 'Top 75% do ranking', color: 'bg-orange-400 text-white' },
  { label: '💀 VAR me Ajuda', desc: 'Bottom 25% do ranking', color: 'bg-red-500 text-white' },
]

const BADGES = [
  { icon: '🔮', label: 'Vidente', desc: 'Acertou 5+ placares exatos' },
  { icon: '🇧🇷', label: 'Patriota', desc: 'Apostou Brasil campeão' },
  { icon: '✅', label: 'Completo', desc: 'Preencheu o bolão inteiro e confirmou' },
  { icon: '🔥', label: 'Em Chamas', desc: 'Ultrapassou 200 pontos' },
  { icon: '🎯', label: 'Artilheiro', desc: 'Acertou 3+ gols de craques' },
]

// Exemplos de jogos por categoria de multiplicador FIFA
const FIFA_EXAMPLES = [
  { home: 'Brasil', hc: 'br', away: 'Marrocos', ac: 'ma', diff: 2, mult: '×2.5', label: 'Equilibrado' },
  { home: 'Alemanha', hc: 'de', away: 'Equador', ac: 'ec', diff: 20, mult: '×1.5', label: 'Intermediário' },
  { home: 'França', hc: 'fr', away: 'Haiti', ac: 'ht', diff: 114, mult: '×1.0', label: 'Desequilibrado' },
]

export default function Pontuacao() {
  const [activeTab, setActiveTab] = useState('regras')

  const tabs = [
    { id: 'regras', label: 'REGRAS' },
    { id: 'multiplicadores', label: 'MULTIPLICADORES' },
    { id: 'regressao', label: 'APOSTAS ARRISCADAS' },
    { id: 'categorias', label: 'CATEGORIAS' },
  ]

  return (
    <div>
      <h1 className="font-black text-3xl tracking-widest mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>PONTUAÇÃO</h1>
      <p className="text-gray-400 text-sm mb-6">Entenda como os pontos são calculados no EloGroup World Cup Challenge</p>

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

      {/* ABA: REGRAS */}
      {activeTab === 'regras' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {RULES.map((r, i) => (
              <div key={i} className={`border rounded-xl p-5 ${r.color}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{r.icon}</span>
                  <h2 className={`font-black text-sm tracking-widest ${r.titleColor}`}>{r.stage.toUpperCase()}</h2>
                </div>
                <div className="flex flex-col gap-2">
                  {r.rules.map((rule, j) => (
                    <div key={j} className="flex items-center justify-between bg-white/70 rounded-lg px-3 py-2">
                      <span className="text-xs text-gray-600">{rule.desc}</span>
                      <span className="font-black text-lg text-black ml-2">{rule.pts}{typeof rule.pts === 'number' ? ' pts' : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bônus Brasil */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Flag code="br" />
              <h2 className="font-black text-lg tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>BÔNUS BRASIL 🇧🇷</h2>
            </div>
            <p className="text-xs text-gray-400 mb-4">Jogos do Brasil valem pontos extras em qualquer fase!</p>
            <div className="flex flex-col gap-2">
              {[
                { desc: 'Acertar placar exato de jogo do Brasil', pts: '+3' },
                { desc: 'Acertar vencedor de jogo do Brasil', pts: '+1' },
              ].map((b, i) => (
                <div key={i} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  <span className="text-sm text-gray-700">{b.desc}</span>
                  <span className="font-black text-green-600 text-lg">{b.pts}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bolão dos Craques */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">⚽</span>
              <h2 className="font-black text-lg tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>BOLÃO DOS CRAQUES</h2>
            </div>
            <p className="text-xs text-gray-400 mb-4">Aposte quantos gols cada craque vai fazer na Copa e ganhe bônus!</p>
            <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
              <span className="text-sm text-gray-700">Acertar exatamente os gols de um craque</span>
              <span className="font-black text-yellow-600 text-lg">+5 pts</span>
            </div>
          </div>

          {/* Exemplo de cálculo */}
          <div className="bg-black text-white rounded-xl p-6">
            <h2 className="font-black text-lg tracking-widest mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>💡 EXEMPLO DE CÁLCULO</h2>
            <div className="flex flex-col gap-3 text-sm">
              {[
                { desc: 'Acertar Brasil 2×0 Haiti (placar exato, jogo fácil ×1.0)', pts: '5 × 1.0 + 3 = 8 pts' },
                { desc: 'Acertar Brasil 1×0 Marrocos (placar exato, jogo difícil ×2.5)', pts: '5 × 2.5 + 3 = 15.5 pts' },
                { desc: 'Acertar vencedor Espanha vs Portugal (jogo ×2.5)', pts: '2 × 2.5 = 5 pts' },
                { desc: 'Acertar gols do Neymar na Copa', pts: '+5 pts bônus' },
                { desc: 'Acertar placar exato da Final + Campeão', pts: '18 + 12 = 30 pts' },
              ].map((ex, i) => (
                <div key={i} className={`flex justify-between items-center ${i < 4 ? 'border-b border-gray-700 pb-3' : ''}`}>
                  <span className="text-gray-300 text-xs">{ex.desc}</span>
                  <span className="font-bold text-yellow-400 ml-4 whitespace-nowrap text-xs">{ex.pts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA: MULTIPLICADORES */}
      {activeTab === 'multiplicadores' && (
        <div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-blue-800 text-sm font-medium">
              🎯 <strong>O que é o multiplicador de dificuldade?</strong> Acertar um jogo entre dois grandes favoritos é mais fácil do que acertar uma zebra. Por isso, jogos equilibrados valem mais pontos!
            </p>
          </div>

          {/* Como é calculado */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h2 className="font-black text-lg tracking-widest mb-3" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>📐 COMO É CALCULADO</h2>
            <p className="text-sm text-gray-600 mb-4">
              Usamos o <strong>Ranking FIFA oficial de abril de 2026</strong> como base. A diferença de posição entre os dois times define o multiplicador:
            </p>
            <div className="flex flex-col gap-3 mb-6">
              {[
                { faixa: 'Diferença ≤ 15 posições', mult: '×2.5', label: '🔴 Equilibrado', example: 'Brasil (6º) vs Marrocos (8º) = diferença de 2', bg: 'bg-red-50 border-red-200' },
                { faixa: 'Diferença de 16 a 40 posições', mult: '×1.5', label: '🟡 Intermediário', example: 'Alemanha (10º) vs Equador (30º) = diferença de 20', bg: 'bg-yellow-50 border-yellow-200' },
                { faixa: 'Diferença > 40 posições', mult: '×1.0', label: '🟢 Desequilibrado', example: 'França (1º) vs Haiti (115º) = diferença de 114', bg: 'bg-green-50 border-green-200' },
              ].map((d, i) => (
                <div key={i} className={`border rounded-xl p-4 ${d.bg}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm">{d.label}</span>
                    <span className="font-black text-2xl">{d.mult}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{d.faixa}</p>
                  <p className="text-xs text-gray-400 italic">{d.example}</p>
                </div>
              ))}
            </div>

            {/* Tabela de rankings FIFA */}
            <h3 className="font-black text-sm tracking-widest mb-3" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>🌍 RANKING FIFA DOS 48 TIMES (Abril 2026)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
              {Object.entries(FIFA_RANKINGS).sort((a, b) => a[1] - b[1]).map(([team, rank]) => (
                <div key={team} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-xs text-gray-700">{team}</span>
                  <span className="text-xs font-black text-gray-900">#{rank}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exemplos práticos */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-black text-lg tracking-widest mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>⚡ EXEMPLOS PRÁTICOS</h2>
            <div className="flex flex-col gap-3">
              {FIFA_EXAMPLES.map((ex, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Flag code={ex.hc} />{ex.home}
                      <span className="text-gray-400 text-xs">vs</span>
                      <Flag code={ex.ac} />{ex.away}
                    </div>
                    <span className="font-black text-xl">{ex.mult}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                      ex.label === 'Equilibrado' ? 'bg-red-100 text-red-700' :
                      ex.label === 'Intermediário' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>{ex.label}</span>
                    <span className="text-xs text-gray-400">Diferença de {ex.diff} posições no ranking FIFA</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA: APOSTAS ARRISCADAS */}
      {activeTab === 'regressao' && (
        <div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
            <p className="text-purple-800 text-sm font-medium">
              🎲 <strong>O que são apostas arriscadas?</strong> Quem aposta no azarão e acerta, merece ser mais recompensado do que quem aposta no favorito. É o princípio da coragem!
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h2 className="font-black text-lg tracking-widest mb-3" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>🧮 COMO FUNCIONA</h2>
            <p className="text-sm text-gray-600 mb-4">
              Após o fechamento do bolão, calculamos quantas pessoas apostaram em cada time em cada fase. 
              Quanto menos gente apostou no mesmo time que você, mais pontos você ganha se acertar.
            </p>
            <div className="flex flex-col gap-3 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-500 mb-2 tracking-widest">FÓRMULA</p>
                <p className="font-black text-lg text-center py-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  Multiplicador = 1 ÷ (% que apostou no mesmo time)
                </p>
                <p className="text-xs text-gray-400 text-center">Limitado entre ×1.0 e ×5.0</p>
              </div>
            </div>

            {/* Exemplos */}
            <h3 className="font-black text-sm tracking-widest mb-3" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>📊 EXEMPLOS</h3>
            <div className="flex flex-col gap-3">
              {[
                {
                  time: 'França nas Quartas', flag: 'fr',
                  apostas: '80%', mult: '×1.25',
                  cor: 'bg-green-50 border-green-200',
                  desc: 'Todo mundo apostou — pouco risco, pouca recompensa extra'
                },
                {
                  time: 'Marrocos nas Quartas', flag: 'ma',
                  apostas: '30%', mult: '×3.3',
                  cor: 'bg-yellow-50 border-yellow-200',
                  desc: 'Poucos apostaram — risco médio, boa recompensa'
                },
                {
                  time: 'Panamá nas Quartas', flag: 'pa',
                  apostas: '5%', mult: '×5.0 (máx)',
                  cor: 'bg-red-50 border-red-200',
                  desc: 'Quase ninguém apostou — alto risco, recompensa máxima!'
                },
              ].map((ex, i) => (
                <div key={i} className={`border rounded-xl p-4 ${ex.cor}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Flag code={ex.flag} />
                      <span className="font-bold text-sm">{ex.time}</span>
                    </div>
                    <span className="font-black text-xl">{ex.mult}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500">{ex.apostas} dos participantes apostaram nesse time</span>
                  </div>
                  <p className="text-xs text-gray-400 italic">{ex.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h2 className="font-black text-lg tracking-widest mb-3" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>📅 QUANDO É CALCULADO</h2>
            <div className="flex flex-col gap-3">
              {[
                { step: '1', desc: 'O bolão fecha no dia 10 de junho, véspera da Copa', icon: '🔒' },
                { step: '2', desc: 'Calculamos a popularidade de cada palpite entre todos os participantes', icon: '📊' },
                { step: '3', desc: 'Os multiplicadores são fixados e aplicados durante toda a Copa', icon: '✅' },
                { step: '4', desc: 'Quanto mais raro seu palpite, mais você ganha se acertar!', icon: '🏆' },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-3 border border-gray-100 rounded-lg px-4 py-3">
                  <span className="text-xl">{s.icon}</span>
                  <div>
                    <span className="text-xs font-bold text-gray-400">PASSO {s.step}</span>
                    <p className="text-sm text-gray-700">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-black text-white rounded-xl p-6">
            <h2 className="font-black text-lg tracking-widest mb-3" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>💡 COMBINANDO OS MULTIPLICADORES</h2>
            <p className="text-gray-300 text-xs mb-4">Os dois multiplicadores são aplicados juntos — jogo difícil + aposta arriscada = pontuação máxima!</p>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-xs text-gray-300 mb-2">Exemplo: Você apostou no Panamá passando nas Quartas</p>
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Pontos base (vencedor certo)</span>
                  <span className="text-white font-bold">7 pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">× Dificuldade do jogo (FIFA)</span>
                  <span className="text-yellow-400 font-bold">×1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">× Aposta arriscada (só 5% apostou)</span>
                  <span className="text-yellow-400 font-bold">×5.0</span>
                </div>
                <div className="border-t border-white/20 mt-2 pt-2 flex justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-yellow-400 font-black text-lg">35 pts!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA: CATEGORIAS */}
      {activeTab === 'categorias' && (
        <div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🏅</span>
              <h2 className="font-black text-lg tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>CATEGORIAS</h2>
            </div>
            <p className="text-xs text-gray-400 mb-4">Sua categoria muda conforme você sobe no ranking. Seja honesto — todo mundo sabe quem é o VAR me Ajuda!</p>
            <div className="flex flex-col gap-3">
              {CATEGORIES.map((cat, i) => (
                <div key={i} className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3">
                  <span className="text-sm text-gray-700">{cat.desc}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded ${cat.color}`}>{cat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🎖️</span>
              <h2 className="font-black text-lg tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>CONQUISTAS</h2>
            </div>
            <p className="text-xs text-gray-400 mb-4">Badges especiais que aparecem no seu perfil e no ranking!</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {BADGES.map((badge, i) => (
                <div key={i} className="flex items-center gap-3 border border-gray-100 rounded-lg px-4 py-3">
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <p className="font-bold text-sm">{badge.label}</p>
                    <p className="text-xs text-gray-400">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}