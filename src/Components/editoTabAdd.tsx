import React, { useState, useRef, useCallback } from 'react'
import * as Icons from '@heroicons/react/24/outline'
import { createOeuvre } from '../api/client'
import InputField from './input'
import Button from './button'

const CATEGORIES = ['Peinture', 'Sculpture', 'Photographie', 'Installation', 'Art sonore', 'Dessin', 'Gravure', 'Autre']

export default function TabAjouter() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [form, setForm] = useState({
    title: '', description: '', medium: '', annee: '',
    dimensions: '', prix: '', statut: 'Disponible', tag: 'Peinture'
  })
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleFileProcessing = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return alert('Le fichier doit être une image.')
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
  }, [])

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileProcessing(file)
  }

  const updateField = (key: string, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  const isFormValid = form.title && form.prix && form.medium && preview

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || !selectedFile) return

    try {
      setLoading(true)
      
      // Passage obligatoire en FormData pour FastAPI (Upload multipart)
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('medium', form.medium)
      formData.append('annee', form.annee)
      formData.append('dimensions', form.dimensions)
      formData.append('prix', form.prix)
      formData.append('statut', form.statut)
      formData.append('tag', form.tag)

      await createOeuvre(formData)
      
      // Petit feedback visuel par le gonzomor
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
      
      // Reset complet du formulaire
      setForm({ title: '', description: '', medium: '', annee: '', dimensions: '', prix: '', statut: 'Disponible', tag: 'Peinture' })
      setPreview(null)
      setSelectedFile(null)
    } catch (err) {
      console.error(err)
      alert('Erreur lors de la publication.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl flex flex-col gap-6 font-sans p-1">
      <h2 className="text-lg font-serif italic font-medium pb-1.5 border-b-2 border-[#E2725B] self-start">
        Ajouter une œuvre
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* drag n drop*/}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400 font-medium pl-1">Image de l'œuvre *</label>
          
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all min-h-62.5 flex flex-col items-center justify-center overflow-hidden ${
              dragging 
                ? 'border-[#E2725B] bg-[#FAECE7]/20 scale-[1.01]' 
                : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {preview ? (
              <div className="relative w-full h-full flex items-center justify-center p-2">
                <img src={preview} alt="Aperçu" className="max-h-64 object-contain rounded-xl shadow-xs" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setPreview(null); setSelectedFile(null) }}
                  className="absolute top-3 right-3 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-600 transition border border-gray-100 cursor-pointer"
                >
                  <Icons.TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="text-center p-6 flex flex-col items-center gap-2 select-none">
                <div className="w-10 h-10 rounded-full bg-[#FAECE7] flex items-center justify-center text-[#E2725B]">
                  <Icons.ArrowUpTrayIcon className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold text-gray-700">Glissez une image ici</p>
                <span className="text-[11px] text-gray-400">ou parcourez vos dossiers</span>
                <span className="text-[9px] text-gray-300 mt-1 font-mono">PNG, JPG, WEBP &bull; Max 10 Mo</span>
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileProcessing(f) }}
          />
        </div>

        {/* CHAMPS TECHNIQUES DU FORMULAIRE */}
        <div className="flex flex-col gap-4">
          <InputField
            label="Titre *"
            placeholder="Nom de l'œuvre"
            value={form.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('title', e.target.value)}
            className="text-gray-900"
          />

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Médium *"
              placeholder="Huile sur toile"
              value={form.medium}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('medium', e.target.value)}
              className="text-gray-900"
            />
            <InputField
              label="Année"
              placeholder="2024"
              type="number"
              value={form.annee}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('annee', e.target.value)}
              className="text-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Dimensions"
              placeholder="120 × 90 cm"
              value={form.dimensions}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('dimensions', e.target.value)}
              className="text-gray-900"
            />
            <InputField
              label="Prix (€) *"
              placeholder="2 500"
              type="number"
              value={form.prix}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('prix', e.target.value)}
              className="text-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-medium pl-1">Catégorie</label>
              <select
                value={form.tag}
                onChange={(e) => updateField('tag', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#E2725B] bg-white text-gray-700 font-medium cursor-pointer"
              >
                {CATEGORIES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-medium pl-1">Disponibilité</label>
              <select
                value={form.statut}
                onChange={(e) => updateField('statut', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#E2725B] bg-white text-gray-700 font-medium cursor-pointer"
              >
                <option value="Disponible">Disponible</option>
                <option value="Réservée">Réservée</option>
                <option value="Vendue">Vendue</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-medium pl-1">Description</label>
            <textarea
              placeholder="Décrivez l'œuvre, son contexte, ses inspirations…"
              rows={3}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#E2725B] bg-white text-gray-700 transition resize-none"
            />
          </div>

          {/* Bouton de validation unifié avec gestion des états d'UI requis */}
          <div className="flex flex-col gap-2 mt-2">
            <Button
              label={loading ? "Publication..." : submitted ? "Oeuvre ajoutée avec succès" : "Publier l'œuvre"}
              size="lg"
              className={`w-full text-white transition cursor-pointer ${
                submitted ? 'bg-green-600 hover:bg-green-700' : 'bg-[#E2725B] hover:bg-[#c85e48]'
              }`}
            />
            
            {!isFormValid && (
              <p className="text-[10px] text-gray-400 text-center font-medium">
                Titre, médium, prix et image sont requis
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
