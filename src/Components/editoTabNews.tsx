// components/editoTabNews.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getArticles } from '../api/client'
import type { Article } from '../types'

export default function TabNews() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  // Récupération des articles sur le serveur
  useEffect(() => {
    getArticles()
      .then((res) => {
        const data = res as Article[]
        setArticles(data?.length ? data : [
          { id: 1, rubrique: 'Dans l\'Atelier', titre: 'Dans l’atelier secret de Sandra Vasquez', excerpt: 'Découvrez les coulisses de la création des silhouettes mythologiques au fusain...', author: 'Admin', date: 'Hier', readTime: 5, imageColor: '#FAECE7', featured: true },
          { id: 2, rubrique: 'Le Manifeste', titre: 'L’art contemporain et la quête du brut', excerpt: 'Pourquoi le retour aux textures primitives s’impose cette saison.', author: 'Équipe Wart', date: 'Il y a 3j', readTime: 3, imageColor: '#e8f0f5' },
          { id: 3, rubrique: 'Zoom sur...', titre: 'Shane : Le Jedi du graphisme sonore', excerpt: 'Retour sur une exposition immersive qui bouscule les codes de la galerie standard.', author: 'Wart', date: 'Il y a 1 sem.', readTime: 4, imageColor: '#f4f4f5' }
        ])
      })
      .catch((err) => console.error('Erreur articles edito:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="text-xs font-mono text-gray-400 py-4">Chargement des articles éditoriaux...</div>
  }

  const [featured, ...others] = articles

  return (
    <div className="w-full max-w-xl flex flex-col gap-6 font-sans">
      <h2 className="inline-block text-lg font-serif italic font-medium pb-1.5 border-b-2 border-[#E2725B] self-start">
        Actualités & Édito
      </h2>

      <div className="flex flex-col gap-5">
        {/* L'ARTICLE À LA UNE (Mis en avant en grand format) */}
        {featured && (
          <div
            onClick={() => navigate(`/edito/${featured.id}`)}
            className="group flex flex-col rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-xs hover:border-gray-200 transition cursor-pointer"
          >
            <div 
              className="h-44 w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.01]"
              style={{ background: featured.imageColor || '#f9fafb' }} // Remplacement par imageUrl en prod
            />
            <div className="p-4 flex flex-col gap-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#993C1D] bg-[#FAECE7] px-2 py-0.5 rounded-md self-start">
                {featured.rubrique}
              </span>
              <h3 className="text-base font-serif font-semibold text-gray-900 italic leading-snug group-hover:text-[#E2725B] transition-colors">
                {featured.titre}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{featured.excerpt}</p>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium font-mono mt-1">
                <span>{featured.date}</span>
                <span>&bull;</span>
                <span>{featured.readTime} min de lecture</span>
              </div>
            </div>
          </div>
        )}

        {/* LISTE DES ARTICLES SECONDAIRES*/}
        <div className="flex flex-col gap-3">
          {others.map((news) => (
            <div
              key={news.id}
              onClick={() => navigate(`/edito/${news.id}`)}
              className="group flex gap-4 p-3 bg-white border border-gray-50 rounded-xl hover:border-gray-200 hover:shadow-2xs transition cursor-pointer items-center"
            >
              <div
                className="w-16 h-16 rounded-lg shrink-0 bg-cover bg-center"
                style={{ background: news.imageColor || '#f3f4f6' }}
              />
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400">
                  {news.rubrique}
                </span>
                <h4 className="text-sm font-semibold text-gray-900 leading-tight group-hover:text-[#E2725B] transition-colors truncate pr-2">
                  {news.titre}
                </h4>
                <p className="text-xs text-gray-400 line-clamp-1 leading-normal">{news.excerpt}</p>
                <span className="text-[10px] text-gray-400 font-mono mt-0.5">{news.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

// FUCK ENSPY