import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth' 
import InputField from '../Components/input' 
import Button from '../Components/button' 

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // État local réactif pour le formulaire contrôlé
  const [form, setForm] = useState({
    username: user?.username || '',
    email: user?.email || ''
  })
  const [updating, setUpdating] = useState(false)

  if (!user) return null

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.username || !form.email) return alert('Champs obligatoires')
    
    try {
      setUpdating(true)
      // Coco loulou on te wait
      console.log('Enregistrement des données:', form)
      alert('Informations mises à jour (simulation)')
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="px-6 sm:px-10 pt-10 pb-20 max-w-2xl mx-auto font-sans flex flex-col gap-6">
      
      {/* En-tête */}
      <div>
        <span className="text-[10px] tracking-widest text-[#E2725B] uppercase font-bold block mb-1">Mon compte</span>
        <h1 className="text-3xl font-serif text-gray-900 italic">Profil</h1>
        <div className="mt-2 w-10 h-0.5 bg-[#E2725B]" />
      </div>

      {/* Carte d'identité utilisateur */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center gap-5 shadow-2xs">
        <div className="w-14 h-14 rounded-full bg-[#FAECE7] flex items-center justify-center text-base font-bold text-[#993C1D] shrink-0">
          {user.username.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h4 className="text-base font-semibold text-gray-900 truncate leading-none mb-1.5">{user.username}</h4>
          <span className="text-xs text-gray-400 block truncate leading-none mb-2">{user.email}</span>
          <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-md bg-[#FAECE7] text-[#993C1D]">
            {user.role === 'artiste' ? 'Artiste' : 'Collectionneur'}
          </span>
        </div>
      </div>

      {/* Boîtier de modification */}
      <form onSubmit={handleSave} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-2xs flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-1">Modifier mes informations</h3>
        
        <InputField
          label="Nom d'utilisateur"
          value={form.username}
          placeholder="votre nom"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, username: e.target.value })}
          className="text-gray-900"
        />

        <InputField
          label="Adresse e-mail"
          type="email"
          value={form.email}
          placeholder="votre@email.com"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="text-gray-900"
        />

        <div className="flex justify-end mt-2">
          <Button
            label={updating ? "Enregistrement..." : "Enregistrer"}
            size="md"
            className="text-white bg-[#E2725B] hover:bg-[#c85e48]"
          />
        </div>
      </form>

      {/* Déconnexion secondaire */}
      <button
        onClick={() => { logout(); navigate('/auth') }}
        className="w-full py-2.5 border border-red-100 text-red-500 font-medium text-xs rounded-xl hover:bg-red-50 transition cursor-pointer uppercase tracking-wider"
      >
        Se déconnecter
      </button>
    </div>
  )
}
