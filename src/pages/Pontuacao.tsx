function Flag({ code }: { code: string }) {
  return <span className={`fi fi-${code} rounded-sm`} style={{ fontSize: '1.2rem', lineHeight: 1 }}></span>
}

const RULES = [
  { stage: 'Fase de Grupos', icon: '⚽', color: 'bg-blue-50 border-blue-200', titleColor: 'text-blue-700',
    rules: [
      { desc: 'Acertar o placar exato', pts: 5 },
      { desc: 'Acertar apenas o vencedor ou empate', pts: 2 },
      { desc: 'Time classificado no lugar certo', pts: '—' },
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

export default function Pontuacao() {
  return (
    <div>
      <h1 className="font-black text-3xl tracking-widest mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>PONTUAÇÃO</h1>
      <p className="text-gray-400 text-sm mb-8">Entenda como os pontos são calculados no EloGroup World Cup Challenge</p>

      {/* Pontuação por fase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
                  <span className="font-black text-lg text-black ml-2">{rule.pts} {typeof rule.pts === 'number' ? 'pts' : ''}</span>
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
          <h2 className="font-black text-lg tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>BÔNUS BRASIL</h2>
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

      {/* Multiplicador */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🎯</span>
          <h2 className="font-black text-lg tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>MULTIPLICADOR DE DIFICULDADE</h2>
        </div>
        <p className="text-xs text-gray-400 mb-4">Acertar um jogo equilibrado vale mais do que acertar um jogo fácil!</p>
        <div className="flex flex-col gap-3">
          {[
            { desc: 'Jogo equilibrado (times próximos no ranking FIFA)', pts: '×2.5', example: 'Ex: Espanha vs Portugal' },
            { desc: 'Jogo intermediário', pts: '×1.5', example: 'Ex: Brasil vs Marrocos' },
            { desc: 'Jogo desequilibrado (times distantes no ranking)', pts: '×1.0', example: 'Ex: Brasil vs Haiti' },
          ].map((d, i) => (
            <div key={i} className="border border-gray-100 rounded-lg px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{d.desc}</span>
                <span className="font-black text-xl text-black">{d.pts}</span>
              </div>
              <p className="text-xs text-gray-400">{d.example}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categorias */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🏅</span>
          <h2 className="font-black text-lg tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>CATEGORIAS</h2>
        </div>
        <p className="text-xs text-gray-400 mb-4">Sua categoria muda conforme você sobe no ranking!</p>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat, i) => (
            <div key={i} className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3">
              <span className="text-sm text-gray-700">{cat.desc}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded ${cat.color}`}>{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conquistas */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🎖️</span>
          <h2 className="font-black text-lg tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>CONQUISTAS</h2>
        </div>
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

      {/* Exemplo */}
      <div className="bg-black text-white rounded-xl p-6">
        <h2 className="font-black text-lg tracking-widest mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>💡 EXEMPLO DE CÁLCULO</h2>
        <div className="flex flex-col gap-3 text-sm">
          {[
            { desc: 'Acertar Brasil 2×0 Haiti (placar exato, jogo fácil)', pts: '5 × 1.0 + 3 = 8 pts' },
            { desc: 'Acertar vencedor Espanha vs Portugal (jogo difícil)', pts: '2 × 2.5 = 5 pts' },
            { desc: 'Acertar gols do Neymar na Copa (bônus craques)', pts: '+5 pts' },
            { desc: 'Acertar placar exato da Final + Campeão', pts: '18 + 12 = 30 pts' },
          ].map((ex, i) => (
            <div key={i} className={`flex justify-between items-center ${i < 3 ? 'border-b border-gray-700 pb-3' : ''}`}>
              <span className="text-gray-300">{ex.desc}</span>
              <span className="font-bold text-yellow-400 ml-4 whitespace-nowrap">{ex.pts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}