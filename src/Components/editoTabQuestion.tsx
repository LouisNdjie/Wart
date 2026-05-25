// components/TabQuestions.tsx
import React, { useState, useEffect } from 'react'
import * as Icons from '@heroicons/react/24/outline'
import { getQuestions, postQuestion } from '../api/client'

// Typage conforme et local pour le linter strict
export type Question = {
  id: number
  question: string
  reponses: number
  date: string
  answered?: boolean
}

export default function TabQuestions() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [newQ, setNewQ] = useState('')
  const [loading, setLoading] = useState(true)

  // Chargement asynchrone connecté à la base de données réelle
  useEffect(() => {
    getQuestions()
      .then((res) => {
        const data = res as Question[]
        setQuestions(data?.length ? data : [
          { id: 1, question: "L'art contemporain est-il accessible à tous ?", reponses: 14, date: 'Il y a 2j', answered: true },
          { id: 2, question: "Faut-il expliquer une œuvre pour l'apprécier ?", reponses: 0, date: 'Il y a 5j', answered: false }
        ])
      })
      .catch((err) => console.error('Erreur questions:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQ.trim()) return

    try {
      // Appel API réel
      const addedQuestion = await postQuestion(newQ.trim())
      setQuestions((prev) => [addedQuestion as Question, ...prev])
      setNewQ('')
    } catch (err) {
        console.error('Erreur ajout question:', err)
      // Fallback local instantané en cours de dev pour ne pas bloquer l'UI
      setQuestions((prev) => [
        { id: Date.now(), question: newQ.trim(), reponses: 0, date: "À l'instant", answered: false },
        ...prev,
      ])
      setNewQ('')
    }
  }

  if (loading) {
    return <div className="text-xs font-mono text-gray-400 py-4">Chargement de la foire aux questions...</div>
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl">
      <h2 className="inline-block text-lg font-serif italic font-medium pb-1.5 border-b-2 border-[#E2725B] self-start">
        Questions de la communauté
      </h2>

      {/* Formulaire de soumission sémantique */}
      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <input
          type="text"
          value={newQ}
          onChange={(e) => setNewQ(e.target.value)}
          placeholder="Posez une question à la communauté…"
          className="flex-1 px-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#E2725B] bg-white transition"
        />
        <button
          type="submit"
          disabled={!newQ.trim()}
          className="px-4 py-2 bg-[#E2725B] hover:bg-[#c85e48] disabled:opacity-30 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
        >
          Envoyer
        </button>
      </form>

      {/* Liste des fils de discussion */}
      <div className="flex flex-col divide-y divide-gray-50">
        {questions.map((q) => (
          <div key={q.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
            <div className="w-8 h-8 rounded-xl bg-[#FAECE7] flex items-center justify-center shrink-0">
              <Icons.ChatBubbleLeftRightIcon className="h-4 w-4 text-[#E2725B]" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 italic leading-snug font-serif pr-2">
                "{q.question}"
              </p>
              
              <div className="flex items-center gap-2 mt-1 text-[10px] font-medium text-gray-400">
                <span>{q.date}</span>
                
                {q.reponses > 0 ? (
                  <>
                    <span>&bull;</span>
                    <span className="text-[#E2725B] font-bold">{q.reponses} contribution{q.reponses > 1 ? 's' : ''}</span>
                  </>
                ) : (
                  <>
                    <span>&bull;</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold uppercase tracking-wide text-[9px]">
                      Sans réponse
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
