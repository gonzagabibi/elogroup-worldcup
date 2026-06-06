function Flag({ code }: { code: string }) {
  return <span className={`fi fi-${code} rounded-sm`} style={{ fontSize: '1.2rem', lineHeight: 1 }}></span>
}

const RULES = [
  { stage: 'Fase de Grupos', icon: '⚽', color: 'bg-blue-50 border-blue-200', titleColor: 'text-blue-700',
    rules: [{ desc: 'Acertar o placar exato', pts: 3 }, { desc: 'Acertar apenas o vencedor ou empate', pts: 1 }] },
  { stage: 'Rodada de 32', icon: '🏟️', color: 'bg-purple-50 border-purple-200', titleColor: 'text-purple-700',
    rules: [{ desc: 'Acertar o placar exato', pts: 4 }, { desc: 'Acertar o vencedor (incluindo pênaltis)', pts: 2 }] },
  { stage: 'Oitavas de Final', icon: '⚡', color: 'bg-orange-50 border-orange-200', titleColor: 'text-orange-700',
    rules: [{ desc: 'Acertar o placar exato', pts: 5 }, { desc: 'Acertar o vencedor (incluindo pênaltis)', pts: 2 }] },
  { stage: 'Quartas de Final', icon: '🔥', color: 'bg-red-50 border-red-200', titleColor: 'text-red-700',
    rules: [{ desc: 'Acertar o placar exato', pts: 7 }, { desc: 'Acertar o vencedor (incluindo pênaltis)', pts: 3 }] },
  { stage: 'Semifinal', icon: '💥', color: 'bg-yellow-50 border-yellow-200', titleColor: 'text-yellow-700',
    rules: [{ desc: 'Acertar o placar exato', pts: 10 }, { desc: 'Acertar o vencedor (incluindo pênaltis)', pts: 4 }] },
  { stage: 'Final', icon: '🏆', color: 'bg-green-50 border-green-200', titleColor: 'text-green-700',
    rules: [{ desc: 'Acertar o placar exato da final', pts: 15 }, { desc: 'Acertar o vencedor (incluindo pênaltis)', pts: 6 }, { desc: '⭐ Acertar o campeão do mundo', pts: 10 }] },
]

export default function Pontuacao() {
  return (
    <div>
      <h1 className="font-black text-3xl tracking-widest mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>PONTUAÇÃO</h1>
      <p className="text-gray-400 text-sm mb-8">Entenda como os pontos são calculados no EloGroup World Cup Challenge</p>

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
                  <span className="font-black text-lg text-black ml-2">{rule.pts} pts</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

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

      <div className="bg-black text-white rounded-xl p-6">
        <h2 className="font-black text-lg tracking-widest mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>💡 EXEMPLO DE CÁLCULO</h2>
        <div className="flex flex-col gap-3 text-sm">
          {[
            { desc: 'Acertar Brasil 2×0 Haiti (placar exato, jogo fácil)', pts: '3 × 1.0 + 3 = 6 pts' },
            { desc: 'Acertar vencedor Espanha vs Portugal (jogo difícil)', pts: '1 × 2.5 = 2.5 pts' },
            { desc: 'Acertar placar exato da Final + Campeão', pts: '15 + 10 = 25 pts' },
          ].map((ex, i) => (
            <div key={i} className={`flex justify-between items-center ${i < 2 ? 'border-b border-gray-700 pb-3' : ''}`}>
              <span className="text-gray-300">{ex.desc}</span>
              <span className="font-bold text-yellow-400 ml-4 whitespace-nowrap">{ex.pts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}