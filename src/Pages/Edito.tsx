// Pages/Edito.tsx
import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import TabNews from '../Components/editoTabNews'
import TabNotifications from '../Components/editoTabNotification'
import TabCollection from '../Components/editoTabCollection'
import TabQuestions from '../Components/editoTabQuestion'
import TabAjouter from '../Components/editoTabAdd'


type TabId = 'news' | 'notifications' | 'collection' | 'questions' | 'ajouter'

export default function Edito() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TabId>('news')

  // Sécurité : si l'utilisateur n'est pas connecté, on évite le crash
  if (!user) {
    return <div className="p-8 text-xs font-mono text-gray-400">Veuillez vous connecter pour accéder à cet espace.</div>
  }

  const role = user.role // 'artiste', 'collectionneur' ou 'admin'

  // Configuration dynamique des onglets
  const tabsConfig: { id: TabId; label: string; artisteOnly?: boolean }[] = [
    { id: 'news', label: 'Actualités' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'collection', label: 'Ma collection' },
    { id: 'questions', label: 'Questions' },
    { id: 'ajouter', label: '+ Ajouter une œuvre', artisteOnly: true },
  ]

  // Filtrage des onglets selon le rôle de l'utilisateur connecté
  const visibleTabs = tabsConfig.filter(tab => !tab.artisteOnly || role === 'artiste' || role === 'admin')

  return (
    <div className="px-6 sm:px-10 pt-12 pb-20 max-w-3xl mx-auto font-sans flex flex-col gap-6">
      
      {/* EN-TÊTE DE L'ESPACE PERSONNEL */}
      <div>
        <span className="text-[10px] tracking-widest text-[#E2725B] uppercase font-bold block mb-1">
          Espace personnel
        </span>
        <h1 className="text-3xl font-serif text-gray-900 italic">
          Mon Wart
        </h1>
        <div className="mt-2 w-10 h-0.5 bg-[#E2725B]" />
        
        <div className="mt-3 flex items-center gap-2">
          <span className="inline-block text-[9px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-md bg-[#FAECE7] text-[#993C1D]">
            {role === 'artiste' ? 'Artiste' : role === 'admin' ? 'Contrôleur Admin' : 'Collectionneur'}
          </span>
          <span className="text-xs text-gray-400 font-medium font-mono">
            &bull; Connecté en tant que {user.username}
          </span>
        </div>
      </div>

      {/* BARRE DE NAVIGATION PAR ONGLETS */}
      <div className="flex gap-2 flex-wrap border-b border-gray-100 pb-3 mt-2">
        {visibleTabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs px-4 py-2 rounded-xl border transition-all cursor-pointer font-medium ${
                isActive
                  ? 'bg-[#E2725B] border-[#E2725B] text-white shadow-xs'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ZONE DE RENDU DES COMPOSANTS FLUIDES */}
      <div className="w-full mt-2 animate-fade-in">
        {activeTab === 'news'          && <TabNews />}
        {activeTab === 'notifications' && <TabNotifications />}
        {activeTab === 'collection'    && <TabCollection />}
        {activeTab === 'questions'     && <TabQuestions />}
        {activeTab === 'ajouter'       && (role === 'artiste' || role === 'admin') && <TabAjouter />}
      </div>

    </div>
  )
}
