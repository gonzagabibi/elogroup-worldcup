function Flag({ code }: { code: string }) {
  return <span className={`fi fi-${code} rounded-sm`} style={{ fontSize: '1.1rem', lineHeight: 1 }}></span>
}

export default function Dashboard() {
  return (
    <div>
      <h1 className="font-black text-3xl tracking-widest mb-2" style={{fontFamily:'Bebas Neue, sans-serif'}}>DASHBOARD</h1>
      <p className="text-gray-400 text-sm mb-8">Acompanhe os jogos e resultados da Copa do Mundo 2026</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'PRÓXIMO JOGO', value: <span className="flex items-center gap-2"><Flag code="br"/> Brasil vs <Flag code="ma"/> Marrocos</span>, sub: '13 Jun • 19:00' },
          { label: 'GRUPOS', value: '12 grupos', sub: '48 seleções' },
          { label: 'FASE ATUAL', value: 'Fase de Grupos', sub: 'em andamento' },
        ].map((card, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-semibold text-gray-400 tracking-widest mb-2">{card.label}</p>
            <p className="text-lg font-bold text-black flex items-center gap-1">{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-black text-lg tracking-widest mb-4" style={{fontFamily:'Bebas Neue, sans-serif'}}>GRUPO C — BRASIL</h2>
        {[
          { home: { n:'Brasil', c:'br' }, away: { n:'Marrocos', c:'ma' }, date: '13 Jun', time: '19:00' },
          { home: { n:'Brasil', c:'br' }, away: { n:'Haiti', c:'ht' }, date: '19 Jun', time: '21:30' },
          { home: { n:'Brasil', c:'br' }, away: { n:'Escócia', c:'gb-sct' }, date: '24 Jun', time: '22:00' },
        ].map((match, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <span className="flex items-center gap-2 text-sm font-medium">
              <Flag code={match.home.c}/>{match.home.n}
            </span>
            <div className="text-center">
              <span className="text-xs bg-gray-100 px-3 py-1 rounded font-mono">VS</span>
              <p className="text-xs text-gray-400 mt-1">{match.date} • {match.time}</p>
            </div>
            <span className="flex items-center gap-2 text-sm font-medium">
              {match.away.n}<Flag code={match.away.c}/>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}