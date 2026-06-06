export default function Ranking() {
  const mockRanking = [
    { pos: 1, name: 'João Silva', points: 42, correct: 14 },
    { pos: 2, name: 'Maria Santos', points: 38, correct: 12 },
    { pos: 3, name: 'Pedro Costa', points: 35, correct: 11 },
    { pos: 4, name: 'Ana Oliveira', points: 31, correct: 10 },
    { pos: 5, name: 'Carlos Lima', points: 28, correct: 9 },
  ]

  return (
    <div>
      <h1 className="font-black text-3xl tracking-widest mb-2" style={{fontFamily:'Bebas Neue, sans-serif'}}>RANKING</h1>
      <p className="text-gray-400 text-sm mb-8">Classificação dos participantes do EloGroup World Cup Challenge</p>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-black px-6 py-3 flex items-center gap-4">
          <span className="text-yellow-400 font-black tracking-widest text-sm" style={{fontFamily:'Bebas Neue, sans-serif'}}>CLASSIFICAÇÃO GERAL</span>
        </div>
        <div className="divide-y divide-gray-100">
          {mockRanking.map((player) => (
            <div key={player.pos} className="flex items-center gap-4 px-6 py-4">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
                player.pos === 1 ? 'bg-yellow-400 text-black' :
                player.pos === 2 ? 'bg-gray-300 text-black' :
                player.pos === 3 ? 'bg-orange-400 text-white' :
                'bg-gray-100 text-gray-500'
              }`}>{player.pos}</span>
              <span className="flex-1 font-medium text-sm">{player.name}</span>
              <span className="text-xs text-gray-400">{player.correct} acertos</span>
              <span className="font-black text-green-600 text-lg" style={{fontFamily:'Bebas Neue, sans-serif'}}>{player.points} pts</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center mt-4">Ranking atualizado em tempo real conforme os jogos acontecem</p>
    </div>
  )
}