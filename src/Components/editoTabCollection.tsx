import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyCollection } from '../api/client'
import type { OeuvreCollection } from '../types'

export default function TabCollection() {
  const navigate = useNavigate()
  
  const [collection, setCollection] = useState<OeuvreCollection[]>()
  const [loading, setLoading] = useState(true)

  // Chargement
  useEffect(() => {
    getMyCollection()
      .then((res) => {
        const data = res as OeuvreCollection[]
        setCollection(data?.length ? data : [
          { id: 1, title: 'Pancha-mama', artiste: 'Sandra Vasquez', prix: 4800, statut: 'acquise', imageColor: '#FAECE7', date: 'Hier' },
          { id: 2, title: 'Résonances', artiste: 'Shane', prix: 3200, statut: 'en_cours', imageColor: '#e8f0f5', date: 'Il y a 3j' }
        ])
      })
      .catch((err) => console.error('Erreur collection:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="text-xs font-mono text-gray-400 py-4">Chargement de votre collection...</div>
  }

  // Calculs pragmatiques faits à la volée sur les données chargées
  const items = collection || []
  const acquises = items.filter(o => o.statut === 'acquise')
  const enCours = items.filter(o => o.statut === 'en_cours')
  const totalValeur = acquises.reduce((sum, o) => sum + (o.prix || 0), 0)

  return (
    <div className="w-full max-w-xl flex flex-col gap-6 font-sans">
      <h2 className="inline-block text-lg font-serif italic font-medium pb-1.5 border-b-2 border-[#E2725B] self-start">
        Ma collection personnel
      </h2>

      {/* Tableau de bord et présentation de la collection */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Œuvres acquises', val: acquises.length },
          { label: "En cours d'acquisition", val: enCours.length },
          { label: 'Valeur totale', val: `${totalValeur.toLocaleString('fr-FR')} €` },
        ].map((card) => (
          <div key={card.label} className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-2xs">
            <span className="text-lg font-bold text-gray-900 font-mono block leading-none">{card.val}</span>
            <span className="text-[10px] font-medium text-gray-400 block mt-1.5 uppercase tracking-wider">{card.label}</span>
          </div>
        ))}
      </div>

      {/* Liste des acquisitions */}
      <div className="flex flex-col gap-3">
        {items.length === 0 ? (
          <p className="text-xs text-gray-400 italic text-center py-6">Votre espace est encore vide. Commencez à suivre des œuvres pour les voir apparaître ici.</p>
        ) : (
          items.map((oeuvre) => (
            <div
              key={oeuvre.id}
              onClick={() => navigate(`/oeuvres/${oeuvre.id}`)}
              className="group flex items-center gap-4 p-3 bg-white border border-gray-50 rounded-xl cursor-pointer hover:border-gray-200 hover:shadow-2xs transition-all"
            >
              <div 
                className="w-14 h-14 rounded-lg shrink-0 transition-transform duration-300 group-hover:scale-[1.02]" 
                style={{ background: oeuvre.imageColor || '#f3f4f6' }} // Remplacement par image réelle en prod
              />
              
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <h4 className="text-sm font-medium font-serif italic text-gray-900 group-hover:text-[#E2725B] transition-colors truncate pr-2">
                  {oeuvre.title}
                </h4>
                <span className="text-xs text-gray-400 font-medium">
                  Par {oeuvre.artiste} &bull; {oeuvre.date}
                </span>
              </div>
              
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${
                  oeuvre.statut === 'acquise' 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  {oeuvre.statut === 'acquise' ? 'Acquise' : 'En cours'}
                </span>
                <span className="text-xs font-semibold text-gray-900 font-mono">
                  {oeuvre.prix.toLocaleString('fr-FR')} €
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
