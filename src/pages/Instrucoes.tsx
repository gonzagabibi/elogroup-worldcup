
export default function Instrucoes() {
  return (
    <div>
      <h1 className="font-black text-3xl tracking-widest mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>INSTRUÇÕES</h1>
      <p className="text-gray-400 text-sm mb-8">Como funciona o EloGroup World Cup Challenge 2026 🏆</p>

      {/* Cards informativos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'TIMES', value: '48', sub: '12 grupos' },
          { label: 'JOGOS', value: '104', sub: 'no total' },
          { label: 'FASES', value: '6', sub: 'até a final' },
          { label: 'INÍCIO', value: '11 Jun', sub: 'USA • CAN • MEX' },
        ].map((card, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className="font-black text-2xl text-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{card.value}</p>
            <p className="text-xs font-bold text-gray-500 tracking-widest mt-1">{card.label}</p>
            <p className="text-xs text-gray-400">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Como funciona */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
        <div className="bg-black px-6 py-3">
          <span className="text-yellow-400 font-black tracking-widest text-sm" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            🎯 COMO FUNCIONA O BOLÃO
          </span>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-black text-lg">1</div>
              <h3 className="font-bold text-sm">Preencha seu Bolão</h3>
              <p className="text-xs text-gray-500">Aposte os placares de todos os 72 jogos da fase de grupos. O sistema calcula automaticamente quem avança.</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-black text-lg">2</div>
              <h3 className="font-bold text-sm">Complete o Mata-mata</h3>
              <p className="text-xs text-gray-500">Depois da fase de grupos, continue apostando nos confrontos da Rodada de 32, Oitavas, Quartas, Semi e Final.</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-lg">3</div>
              <h3 className="font-bold text-sm">Ganhe Pontos</h3>
              <p className="text-xs text-gray-500">Acertou o placar exato? Mais pontos! Acertou só o vencedor? Também pontua. Quanto mais difícil o jogo, mais vale acertar.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fluxo das fases */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
        <div className="bg-black px-6 py-3">
          <span className="text-yellow-400 font-black tracking-widest text-sm" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            📅 FASES DA COPA 2026
          </span>
        </div>
        <div className="p-4">
          <div className="flex flex-col gap-0">
            {[
              { fase: 'Fase de Grupos', times: '48 times', jogos: '72 jogos', datas: '11 Jun – 2 Jul', cor: 'bg-green-500', desc: '12 grupos de 4 times. Top 2 + 8 melhores 3ºs avançam.' },
              { fase: 'Rodada de 32', times: '32 times', jogos: '16 jogos', datas: '4 – 8 Jul', cor: 'bg-blue-500', desc: 'Mata-mata. Empate no tempo normal vai para pênaltis.' },
              { fase: 'Oitavas de Final', times: '16 times', jogos: '8 jogos', datas: '10 – 13 Jul', cor: 'bg-purple-500', desc: 'Os 16 classificados disputam as oitavas.' },
              { fase: 'Quartas de Final', times: '8 times', jogos: '4 jogos', datas: '15 – 16 Jul', cor: 'bg-orange-500', desc: 'Os 8 melhores brigam pelas semifinais.' },
              { fase: 'Semifinal', times: '4 times', jogos: '2 jogos', datas: '19 – 20 Jul', cor: 'bg-red-500', desc: 'Quatro times, dois lugares na final.' },
              { fase: 'Final', times: '2 times', jogos: '1 jogo', datas: '26 Jul', cor: 'bg-yellow-500', desc: 'O jogo mais importante. Quem vai ser Campeão do Mundo?' },
            ].map((f, i, arr) => (
              <div key={i} className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full ${f.cor} mt-1`}></div>
                  {i < arr.length - 1 && <div className="w-0.5 h-8 bg-gray-200 mt-1"></div>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="font-bold text-sm">{f.fase}</span>
                    <span className="text-xs text-gray-400">{f.datas}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{f.times}</span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{f.jogos}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dicas */}
      <div className="bg-black text-white rounded-xl p-6">
        <h2 className="font-black text-lg tracking-widest mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>💡 DICAS PARA PONTUAR MAIS</h2>
        <div className="flex flex-col gap-3 text-sm">
          {[
            { icon: '🎯', tip: 'Placar exato vale mais do que acertar só o vencedor — tente ser preciso!' },
            { icon: '⚡', tip: 'Jogos equilibrados valem mais — acertar uma zebra pode te catapultar no ranking.' },
            { icon: '🇧🇷', tip: 'Acertos nos jogos do Brasil dão pontos bônus — preste atenção especial!' },
            { icon: '⚽', tip: 'Preencha também o Bolão dos Craques para garantir pontos bônus extras.' },
            { icon: '🔒', tip: 'Confirme seu bolão antes do início da Copa. Após isso não é possível editar.' },
          ].map((d, i) => (
            <div key={i} className={`flex items-start gap-3 ${i < 4 ? 'border-b border-gray-800 pb-3' : ''}`}>
              <span className="text-lg flex-shrink-0">{d.icon}</span>
              <p className="text-gray-300 text-xs">{d.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}