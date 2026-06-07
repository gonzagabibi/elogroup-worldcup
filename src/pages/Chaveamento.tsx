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

const MATCHES = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]


function Flag({ code }: { code: string }) {
  return <span className={`fi fi-${code} rounded-sm`} style={{ fontSize: '1.1rem', lineHeight: 1, flexShrink: 0 }} />
}

function EmptySlot() {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-gray-50 border border-dashed border-gray-200">
      <div className="w-4 h-4 rounded-sm bg-gray-200 flex-shrink-0" />
      <span className="text-xs text-gray-300">A definir</span>
    </div>
  )
}


export default function Chaveamento() {
  const [activeTab, setActiveTab] = useState<'grupos' | 'matamata'>('grupos')

  const STAGE_LABELS: Record<string, string> = {
    r32: 'Rodada de 32', oitavas: 'Oitavas de Final',
    quartas: 'Quartas de Final', semi: 'Semifinal', final: 'Final'
  }

  const STAGE_COUNTS: Record<string, number> = {
    r32: 16, oitavas: 8, quartas: 4, semi: 2, final: 1
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-black text-3xl tracking-widest mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>CHAVEAMENTO</h1>
        <p className="text-gray-400 text-sm">Copa do Mundo 2026 — USA · CAN · MEX · 11 Jun a 19 Jul</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {[{ id: 'grupos', label: '⚽ GRUPOS' }, { id: 'matamata', label: '🏆 MATA-MATA' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 text-xs font-semibold tracking-widest border-b-2 transition ${
              activeTab === tab.id ? 'border-yellow-400 text-black' : 'border-transparent text-gray-400 hover:text-black'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ABA GRUPOS */}
      {activeTab === 'grupos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GROUPS.map((g) => (
            <div key={g.name} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-black px-4 py-2">
                <span className="font-black text-yellow-400 tracking-widest text-sm" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  GRUPO {g.name}
                </span>
              </div>
              {/* Times */}
              <div className="px-3 pt-3 pb-2 border-b border-gray-100">
                <div className="flex flex-col gap-1">
                  {g.teams.map((t, i) => (
                    <div key={t.n} className="flex items-center gap-2 text-xs py-0.5">
                      <span className="text-gray-400 w-4 text-right">{i + 1}</span>
                      <Flag code={t.c} />
                      <span className="text-gray-700">{t.n}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Jogos */}
              <div className="divide-y divide-gray-50">
                {MATCHES.map(([ai, bi]) => (
                  <div key={`${ai}-${bi}`} className="flex items-center gap-2 px-3 py-1.5">
                    <span className="flex items-center gap-1 flex-1 text-xs">
                      <Flag code={g.teams[ai].c} />
                      <span className="text-gray-500 truncate">{g.teams[ai].n}</span>
                    </span>
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">vs</span>
                    <span className="flex items-center gap-1 flex-1 justify-end text-xs">
                      <span className="text-gray-500 truncate">{g.teams[bi].n}</span>
                      <Flag code={g.teams[bi].c} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ABA MATA-MATA */}
      {activeTab === 'matamata' && (
        <div className="flex flex-col gap-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
            <p className="text-yellow-800 text-xs font-medium">
              ⏳ Os confrontos serão preenchidos automaticamente conforme os jogos acontecem
            </p>
          </div>

          {['r32', 'oitavas', 'quartas', 'semi', 'final'].map(st => (
            <div key={st}>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="font-black text-sm tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  {STAGE_LABELS[st].toUpperCase()}
                </h2>
                <div className="h-px flex-1 bg-gray-200"></div>
                <span className="text-xs text-gray-400">{STAGE_COUNTS[st]} {STAGE_COUNTS[st] === 1 ? 'jogo' : 'jogos'}</span>
              </div>
              <div className={`grid gap-2 ${
                st === 'r32' ? 'grid-cols-2 md:grid-cols-4' :
                st === 'oitavas' ? 'grid-cols-2 md:grid-cols-4' :
                st === 'quartas' ? 'grid-cols-2' :
                st === 'semi' ? 'grid-cols-1 md:grid-cols-2' :
                'grid-cols-1 max-w-xs mx-auto'
              }`}>
                {Array.from({ length: STAGE_COUNTS[st] }).map((_, i) => (
                  <div key={i} className={`rounded-lg border p-2 bg-white ${st === 'final' ? 'border-yellow-300' : 'border-gray-200'}`}>
                    <EmptySlot />
                    <div className="text-center text-gray-300 text-xs my-1">×</div>
                    <EmptySlot />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}