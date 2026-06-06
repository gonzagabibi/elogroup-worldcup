import { useState } from 'react'
import { supabase } from '../lib/supabase'
import eloLogo from '../assets/02 Logotipo sem fundo_preto.png'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } }
      })
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('Email ou senha incorretos')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="h-1 bg-green-600"></div>
      <div className="h-1 bg-yellow-400"></div>
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="mb-8 text-center">
          <img src={eloLogo} alt="EloGroup" className="h-10 mx-auto mb-3" />
          <span className="inline-block bg-green-600 text-white text-xs font-bold tracking-widest px-3 py-1 rounded-full">WORLD CUP CHALLENGE 2026</span>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-sm shadow-sm">
          <h2 className="text-lg font-bold mb-6 text-black">{isSignUp ? 'Criar conta' : 'Entrar'}</h2>
          {isSignUp && (
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 mb-1 tracking-wider">NOME COMPLETO</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600" placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1 tracking-wider">EMAIL</label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600" placeholder="seu@email.com" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 mb-1 tracking-wider">SENHA</label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600" placeholder="Mínimo 6 caracteres" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
          {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
          <button onClick={handleSubmit} disabled={loading} className="w-full bg-green-600 text-white font-bold py-2.5 rounded-lg text-sm tracking-wider hover:bg-green-700 transition disabled:opacity-50">
            {loading ? 'Aguarde...' : isSignUp ? 'CRIAR CONTA' : 'ENTRAR'}
          </button>
          <button onClick={() => { setIsSignUp(!isSignUp); setError('') }} className="w-full mt-3 text-green-600 text-sm font-medium hover:underline">
            {isSignUp ? 'Já tenho conta' : 'Não tem conta? Criar agora'}
          </button>
        </div>
      </div>
      <div className="h-1 bg-yellow-400"></div>
      <div className="h-1 bg-green-600"></div>
    </div>
  )
}