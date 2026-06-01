import { useState } from 'react'
import Button from './button'
import InputField from './input'
import { demanderAchat } from '../api/client'

export default function ModalAchat({ 
  oeuvreId, 
  titre = 'Les péripéties de Shane Le Jedi', 
  prix, 
  onClose 
}: { 
  oeuvreId: number
  titre?: string
  prix: number
  onClose: () => void 
}) {
  
  // État local du formulaire 
  const [form, setForm] = useState({ nom: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nom || !form.email) return alert('Veuillez remplir les champs obligatoires')
    
    try {
      setLoading(true)
      await demanderAchat(oeuvreId, form)
      alert('Demande envoyée avec succès !')
      onClose()
    } catch (err) {
      console.error(err)
      alert('Erreur lors de la commande')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-serif font-medium text-gray-900 italic">
            Demande d'achat
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Détails Oeuvre */}
        <div className="bg-[#FAECE7] rounded-xl px-4 py-3 flex items-center justify-between gap-2">
          <span className="text-sm text-gray-700 truncate">{titre}</span>
          <span className="text-sm font-semibold text-[#993C1D] shrink-0">
            {prix.toLocaleString('fr-FR')} €
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <InputField
            label="Votre nom complet"
            placeholder="Ex: Jean Dupont"
            required
            value={form.nom}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, nom: e.target.value })}
            // Fuck
            className="text-gray-900" 
          />
          
          <InputField
            label="Adresse email"
            type="email"
            placeholder="jean.dupont@exemple.com"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="text-gray-900"
          />

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs text-gray-600 tracking-wide font-medium">
              Message (optionnel)
            </label>
            <textarea
              placeholder="Questions particulières sur la livraison, encadrement..."
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#E2725B] transition-colors resize-none"
            />
          </div>
        </div>

        <Button 
          label={loading ? "Envoi en cours..." : "Passer la commande"} 
          size="lg"
          className="w-full mt-1 text-white" // suircharge du bouton
        />

        <p className="text-[10px] text-gray-400 text-center leading-relaxed">
          Un expert Wart vous contactera sous 48h pour finaliser votre acquisition.
        </p>
      </form>
    </div>
  )
}
