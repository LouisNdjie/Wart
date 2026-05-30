import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Icons from '@heroicons/react/24/outline'
import InputField from '../Components/input' 
import Button from '../Components/button'          
import { login, register } from '../api/client'
import useAuth from '../hooks/useAuth'             
import type { AuthMode, UserRole, User } from '../types'
import logo from '../assets/wart.svg'
import bgform from '../assets/bg-form.jpg'

export default function AuthPage() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  
  const [mode, setMode] = useState<AuthMode>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Un seul objet d'état pour tout le formulaire : le grand classique des humains
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'collectionneur' as UserRole
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation rapide à la main
    if (mode === 'login' && (!form.email || !form.password)) {
      return setError('Veuillez remplir tous les champs.')
    }
    if (mode === 'register' && (!form.username || !form.email || !form.password)) {
      return setError('Veuillez remplir tous les champs.')
    }

    setLoading(true)
    try {
      const loggedUser = mode === 'login' 
        ? await login(form.email, form.password)
        : await register(form.username, form.email, form.password, form.role)
      
      setUser(loggedUser as User)
      navigate('/')
    } catch (err: unknown) {
      setError((err as Error)?.message || "Erreur d'authentification.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center px-4 bg-cover bg-center font-sans"
      style={{ backgroundImage: `url(${bgform})` }}
    >
      <div className="w-full max-w-sm flex flex-col gap-5">
        
        {/* En-tête */}
        <div className="text-left">
          <img src={logo} alt="Wart" className="h-12 w-auto cursor-pointer" onClick={() => navigate('/')} />
          <p className="mt-1 text-xs text-white/60 tracking-wide">
            {mode === 'login' ? 'Ravi de vous revoir' : 'Rejoignez la collection'}
          </p>
        </div>

        {/* Switcher de mode (Bascule) */}
        <div className="flex bg-white/15 border border-white/10 rounded-xl p-1 shadow-sm backdrop-blur-xs">
          <button
            type="button"
            onClick={() => { setMode('login'); setError('') }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login' ? 'bg-[#E2725B] text-white shadow-xs' : 'text-white/60 hover:text-white'
            }`}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError('') }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'register' ? 'bg-[#E2725B] text-white shadow-xs' : 'text-white/60 hover:text-white'
            }`}
          >
            Créer un compte
          </button>
        </div>

        {/* Boîtier unique de formulaire */}
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
          
          {error && (
            <div className="text-xs text-red-200 bg-red-950/40 border border-red-900/40 rounded-xl px-3 py-2 font-medium">
              {error}
            </div>
          )}

          {/* Sélecteur de rôle en ligne (uniquement à l'inscription) */}
          {mode === 'register' && (
            <div className="flex flex-col gap-2">
              <label className="text-xs text-white/70 tracking-wide font-medium">Je rejoins en tant que</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: 'collectionneur' })}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition cursor-pointer ${
                    form.role === 'collectionneur'
                      ? 'border-[#E2725B] bg-[#FAECE7]/20 text-white font-semibold'
                      : 'border-white/10 bg-white/5 text-white/50 hover:border-white/30'
                  }`}
                >
                  <Icons.BookmarkSquareIcon className="h-5 w-5 opacity-80" />
                  <span className="text-xs">Collectionneur</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: 'artiste' })}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition cursor-pointer ${
                    form.role === 'artiste'
                      ? 'border-[#E2725B] bg-[#FAECE7]/20 text-white font-semibold'
                      : 'border-white/10 bg-white/5 text-white/50 hover:border-white/30'
                  }`}
                >
                  <Icons.PaintBrushIcon className="h-5 w-5 opacity-80" />
                  <span className="text-xs">Artiste</span>
                </button>
              </div>
            </div>
          )}

          {mode === 'register' && (
            <InputField
              label="Nom d'utilisateur"
              placeholder="Ex: Shane SKYWALKER"
              value={form.username}
              onChange={(e:React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, username: e.target.value })}
              icon={<Icons.UserIcon className="h-4 w-4" />}
            />
          )}

          <InputField
            label="Adresse e-mail"
            type="email"
            placeholder="shane@jedi.com"
            value={form.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })}
            icon={<Icons.EnvelopeIcon className="h-4 w-4" />}
          />

          <InputField
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, password: e.target.value })}
            icon={<Icons.LockClosedIcon className="h-4 w-4" />}
          />

          {mode === 'login' && (
            <div className="flex justify-end -mt-1">
              <button type="button" className="text-[11px] text-white/50 hover:text-[#E2725B] transition hover:underline">
                Mot de passe oublié ?
              </button>
            </div>
          )}

          <Button
            label={loading ? "Traitement..." : mode === 'login' ? "Se connecter" : "Créer mon compte"}
            size="lg"
            className="w-full mt-2 text-white bg-[#E2725B] hover:bg-[#c85e48]"
          />
        </form>

        {/* Le footer de page inclus proprement */}
        <p className="text-center text-[10px] text-white/40 leading-relaxed px-4">
          En continuant, vous acceptez les{' '}
          <a href="/cgu" className="underline underline-offset-2 hover:text-white transition-colors">
            conditions d'utilisation
          </a>{' '}
          de Wart.
        </p>
      </div>
    </div>
  )
}
