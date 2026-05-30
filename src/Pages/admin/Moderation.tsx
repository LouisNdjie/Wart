import { useState, useEffect } from 'react'
import * as Icons from '@heroicons/react/24/outline'
import { 
  getCommentairesSignales, 
  getQuestions, 
  supprimerCommentaire as apiDeleteComment, 
  bannirUser as apiBanUser 
} from '../../api/client'

type ReportedComment = {
  id: number
  auteur: string
  userId: string
  oeuvre: string
  date: string
  message: string
  signalements: number
}

type CommunityQuestion = {
  id: number
  question: string
  reponses: number
  date: string
}

export default function Moderation() {
  const [comments, setComments] = useState<ReportedComment[]>([])
  const [questions, setQuestions] = useState<CommunityQuestion[]>([])
  const [bannedCount, setBannedCount] = useState(2) // Compteur simulé pour la démo
  const [loading, setLoading] = useState(true)

  // Chargement asynchrone synchrone
  useEffect(() => {
    Promise.all([getCommentairesSignales(), getQuestions()])
      .then(([commentsRes, questionsRes]) => {
        setComments((commentsRes as ReportedComment[]) || [
          { id: 1, auteur: 'user_42', userId: 'usr-1', oeuvre: 'Pancha-mama', date: 'Il y a 2h', message: 'Commentaire inapproprié signalé par 3 utilisateurs...', signalements: 3 },
          { id: 2, auteur: 'kart_collector', userId: 'usr-2', oeuvre: 'Éclats de lumière', date: 'Il y a 5h', message: 'Lien externe suspect détecté dans le commentaire...', signalements: 1 },
        ])
        setQuestions((questionsRes as CommunityQuestion[]) || [
          { id: 1, question: "L'art contemporain est-il accessible à tous ?", reponses: 14, date: 'Il y a 2j' },
          { id: 2, question: "Faut-il expliquer une œuvre pour l'apprécier ?", reponses: 23, date: 'Il y a 5j' },
        ])
      })
      .catch(err => console.error('Erreur modération:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleIgnoreComment = (id: number) => {
    setComments(prev => prev.filter(c => c.id !== id))
  }

  const handleDeleteComment = async (id: number) => {
    if (!confirm('Supprimer définitivement ce commentaire ?')) return
    try {
      await apiDeleteComment(id)
      setComments(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      alert('Erreur lors de la suppression')
      console.error(err)
    }
  }

  const handleBanUser = async (commentId: number, userId: string, username: string) => {
    if (!confirm(`Bannir définitivement l'utilisateur ${username} ?`)) return
    try {
      await apiBanUser(userId)
      setComments(prev => prev.filter(c => c.id !== commentId))
      setBannedCount(prev => prev + 1)
    } catch (err) {
      alert("Impossible de bannir l'utilisateur")
      console.error(err)
    }
  }

  if (loading) {
    return <div className="p-8 text-xs font-mono text-gray-400">Chargement de la modération...</div>
  }

  return (
    <div className="p-6 flex flex-col gap-6 max-w-3xl font-sans">
      
      {/* Grille de synthèse*/}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Commentaires signalés', val: comments.length, bg: 'bg-red-50 text-red-700' },
          { label: 'Questions en attente', val: questions.length, bg: 'bg-amber-50 text-amber-700' },
          { label: 'Utilisateurs bannis', val: bannedCount, bg: 'bg-gray-100 text-gray-700' }
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-xs">
            <span className="text-[11px] font-medium text-gray-400 block mb-1">{kpi.label}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{kpi.val}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wide ${kpi.bg}`}>Focus</span>
            </div>
          </div>
        ))}
      </div>

      {/*Commentaires */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">Signalements récents</h3>
        
        {comments.length === 0 ? (
          <p className="text-xs text-gray-400 py-6 text-center italic">Aucun incident en attente.</p>
        ) : (
          <div className="divide-y divide-gray-50 flex flex-col">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <div className="w-8 h-8 rounded-full bg-[#FAECE7] flex items-center justify-center text-xs font-bold text-[#993C1D] shrink-0">
                  {c.auteur?.[0]?.toUpperCase() || 'U'}
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold text-gray-900 block">{c.auteur}</span>
                      <span className="text-[10px] text-gray-400 font-medium">Sur &laquo; {c.oeuvre} &raquo; &bull; {c.date}</span>
                    </div>
                    <span className="text-[10px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-md shrink-0 uppercase tracking-wide">
                      {c.signalements} {c.signalements > 1 ? 'alertes' : 'alerte'}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/50 leading-relaxed">
                    {c.message}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => handleIgnoreComment(c.id)}
                      className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                    >
                      <Icons.CheckIcon className="h-3.5 w-3.5" /> Ignorer
                    </button>
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 bg-red-50 border border-red-100 rounded-lg text-red-600 hover:bg-red-100 transition cursor-pointer"
                    >
                      <Icons.TrashIcon className="h-3.5 w-3.5" /> Supprimer
                    </button>
                    <button
                      onClick={() => handleBanUser(c.id, c.userId, c.auteur)}
                      className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50/50 transition cursor-pointer"
                    >
                      <Icons.NoSymbolIcon className="h-3.5 w-3.5" /> Bannir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Questions Édito */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">Questions de la communauté</h3>
        
        {questions.length === 0 ? (
          <p className="text-xs text-gray-400 py-6 text-center italic">Aucune question en attente.</p>
        ) : (
          <div className="divide-y divide-gray-50 flex flex-col">
            {questions.map((q) => (
              <div key={q.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div className="w-8 h-8 rounded-xl bg-[#FAECE7] flex items-center justify-center shrink-0">
                  <Icons.ChatBubbleLeftRightIcon className="h-4 w-4 text-[#E2725B]" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-serif text-gray-900 italic truncate pr-2">
                    "{q.question}"
                  </p>
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                    {q.reponses} contributions &bull; {q.date}
                  </span>
                </div>
                
                <button className="shrink-0 text-xs font-medium px-3 py-2 bg-[#E2725B] hover:bg-[#c85e48] text-white rounded-lg transition cursor-pointer">
                  Répondre
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
