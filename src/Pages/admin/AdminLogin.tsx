// Pages/admin/AdminLogin.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Icons from '@heroicons/react/24/outline'
import { adminLogin } from '../../api/client'
import Button from '../../Components/button'
import InputField from '../../Components/input'
import logo from '../../assets/wart.svg'

export default function AdminLogin() {
  const navigate = useNavigate()
  
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      return setError('Veuillez remplir tous les champs.')
    }
    
    setError('')
    setLoading(true)
    
    try {
      await adminLogin(form.username, form.password)
      navigate('/admin')
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Identifiants incorrects.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-linear-to-br from-[#1a1208] via-[#2d1f0e] to-[#1e1510] font-sans">
      
      {/* Ambiance lumineuse */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full bg-[#E2725B] opacity-15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full bg-[#6b7a3e] opacity-10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex w-full max-w-2xl mx-4 bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">

        {/* Panneau gauche logo */}
        <div className="hidden sm:flex flex-col items-center justify-center w-64 shrink-0 px-8 py-10 border-r border-white/5 bg-white/2">
          <div className="flex flex-col items-center gap-4 text-center">
            <img src={logo} alt="Wart" className="h-16 w-auto brightness-110 drop-shadow-md" />
            <div className="w-6 h-px bg-[#E2725B]/50" />
            <span className="text-[10px] tracking-widest text-white/40 uppercase font-semibold">Administration</span>
          </div>
          <span className="absolute bottom-6 text-center text-[10px] text-white/20 leading-relaxed">
            Accès réservé<br />au personnel autorisé
          </span>
        </div>

        {/* Panneau droit — formulaire */}
        <form onSubmit={handleSubmit} className="flex-1 px-8 py-10 flex flex-col gap-5">
          <div className="sm:hidden flex justify-center mb-4">
            <img src={logo} alt="Wart" className="h-12 w-auto" />
          </div>

          <div>
            <span className="text-[10px] tracking-widest text-[#E2725B] uppercase font-bold block mb-1">Espace admin</span>
            <h1 className="text-2xl font-serif text-white italic">Connexion</h1>
            <p className="text-xs text-white/40 mt-1">Entrez vos identifiants pour accéder au tableau de bord.</p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Notre composant InputField global adapté */}
            <InputField
              label="Identifiant"
              placeholder="admin"
              value={form.username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, username: e.target.value })}
              icon={<Icons.UserIcon className="h-4 w-4" />}
              className="text-white"
            />

            <div className="relative w-full">
              <InputField
                label="Mot de passe"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, password: e.target.value })}
                icon={<Icons.LockClosedIcon className="h-4 w-4" />}
                className="text-white"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute bottom-3 right-3 text-white/30 hover:text-white/60 transition p-1"
              >
                {showPass ? <Icons.EyeSlashIcon className="h-4 w-4" /> : <Icons.EyeIcon className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-950/40 border border-red-900/50">
                <Icons.ExclamationCircleIcon className="h-4 w-4 text-red-400 shrink-0" />
                <p className="text-xs text-red-300 font-medium">{error}</p>
              </div>
            )}

            {/* Notre bouton personnalisé adapté */}
            <Button
              label={loading ? "Connexion..." : "Se connecter"}
              size="lg"
              className="w-full mt-2 text-white bg-[#E2725B] hover:bg-[#c85e48]"
            />
          </div>

          <p className="mt-4 text-[10px] text-white/20 text-center leading-relaxed">
            Problème de connexion ? Contactez{' '}
            <a href="mailto:admin@wart.cm" className="text-white/40 hover:text-white/60 transition underline underline-offset-4">
              admin@wart.cm
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}
