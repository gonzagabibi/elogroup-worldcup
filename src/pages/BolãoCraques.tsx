import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const CRAQUES = [
  { n: 'Neymar', c: 'br', selecao: 'Brasil' },
  { n: 'Vinicius Jr', c: 'br', selecao: 'Brasil' },
  { n: 'Endrick', c: 'br', selecao: 'Brasil' },
  { n: 'Messi', c: 'ar', selecao: 'Argentina' },
  { n: 'Mbappé', c: 'fr', selecao: 'França' },
  { n: 'CR7', c: 'pt', selecao: 'Portugal' },
  { n: 'Haaland', c: 'no', selecao: 'Noruega' },
  { n: 'Bellingham', c: 'gb-eng', selecao: 'Inglaterra' },
  { n: 'Lamine Yamal', c: 'es', selecao: 'Espanha' },
  { n: 'Modric', c: 'hr', selecao: 'Croácia' },
  { n: 'Salah', c: 'eg', selecao: 'Egito' },
]

function Flag({ code }: { code: string }) {
  return <span className={`fi fi-${code} rounded-sm`} style={{ fontSize: '1.4rem', lineHeight: 1, flexShrink: 0 }} />
}

export default function BolãoCraques() {
  const { user } = useAuth()
  const [palpites, setPalpites] = useState<Record<string, string>>({})
  const [confirmed, setConfirmed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    const { data } = await supabase
      .from('predictions')
      .select('data')
      .eq('user_id', user!.id)
      .single()

    if (data?.data?.craques) {
      setPalpites(data.data.craques)
      if (data.data.craquesConfirmed) setConfirmed(true)
    }
    setLoading(false)
  }

  const handleChange = (name: string, val: string) => {
    if (confirmed) return
    const num = val.replace(/\D/g, '')
    if (parseInt(num) > 20) return
    setPalpites(prev => ({ ...prev, [name]: num }))
  }

  const handleConfirm = async () => {
    setSaving(true)
    const { data } = await supabase
      .from('predictions')
      .select('data')
      .eq('user_id', user!.id)
      .single()

    await supabase.from('predictions').update({
      data: { ...data?.data, craques: palpites, craquesConfirmed: true }
    }).eq('user_id', user!.id)

    setSaving(false)
    setConfirmed(true)
  }

  const allFilled = CRAQUES.every(c => palpites[c.n] !== undefined && palpites[c.n] !== '')
  const totalGols = Object.values(palpites).reduce((acc, v) => acc + (parseInt(v) || 0), 0)

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-black text-3xl tracking-widest mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>BOLÃO DOS CRAQUES</h1>
        <p className="text-gray-400 text-sm">Quantos gols cada craque vai fazer na Copa? Acerto exato = +5pts bônus!</p>
      </div>

      {confirmed && (
        <div className="bg-green-600 text-white text-center py-3 px-6 rounded-xl mb-6 font-semibold tracking-wider">
          🎯 Palpites confirmados! Boa sorte!
        </div>
      )}

      {/* Resumo */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="font-black text-3xl text-green-600" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{totalGols}</p>
          <p className="text-xs text-gray-500 font-bold tracking-widest mt-1">GOLS APOSTADOS</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 text-center">
          <p className="font-black text-3xl text-yellow-600" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            {Object.values(palpites).filter(v => v !== '').length}/{CRAQUES.length}
          </p>
          <p className="text-xs text-gray-500 font-bold tracking-widest mt-1">PREENCHIDOS</p>
        </div>
      </div>

      {/* Lista de craques */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
        <div className="bg-black px-4 py-2">
          <span className="text-yellow-400 font-black tracking-widest text-sm" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            APOSTAS DE GOLS
          </span>
        </div>
        <div className="divide-y divide-gray-100">
          {CRAQUES.map(craque => (
            <div key={craque.n} className="flex items-center gap-4 px-4 py-4">
              <Flag code={craque.c} />
              <div className="flex-1">
                <p className="font-bold text-sm">{craque.n}</p>
                <p className="text-xs text-gray-400">{craque.selecao}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">gols:</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  disabled={confirmed}
                  value={palpites[craque.n] ?? ''}
                  onChange={e => handleChange(craque.n, e.target.value)}
                  placeholder="?"
                  className="w-14 h-10 text-center border-2 border-gray-200 rounded-lg text-lg font-black focus:outline-none focus:border-green-600 disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>
              {palpites[craque.n] !== undefined && palpites[craque.n] !== '' && (
                <span className="text-xs font-bold text-green-600 w-12 text-right">
                  {parseInt(palpites[craque.n]) === 0 ? '0 gols' :
                   parseInt(palpites[craque.n]) === 1 ? '1 gol' :
                   `${palpites[craque.n]} gols`}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {!confirmed && (
        <button
          onClick={handleConfirm}
          disabled={!allFilled || saving}
          className="w-full py-3 bg-green-600 text-white font-bold tracking-widest rounded-xl text-sm hover:bg-green-700 transition disabled:opacity-40 disabled:cursor-not-allowed">
          {saving ? 'SALVANDO...' : allFilled ? 'CONFIRMAR PALPITES' : `PREENCHA TODOS OS ${CRAQUES.length} CRAQUES`}
        </button>
      )}

      <p className="text-xs text-gray-400 text-center mt-4">
        +5pts de bônus por cada acerto exato de gols • Só pode confirmar uma vez
      </p>
    </div>
  )
}