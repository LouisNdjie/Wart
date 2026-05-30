import { useState, useEffect } from 'react'
import * as Icons from '@heroicons/react/24/outline'
import { getNotifications, markNotifRead, markAllNotifsRead } from '../api/client'
import type { Notification } from '../types'

export default function TabNotifications() {
  const [list, setList] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  // Chargement des notifs
  
  useEffect(() => {
    getNotifications()
      .then((res) => {
        const data = res as Notification[]
        setList(data?.length ? data : [
          { id: 1, type: 'achat', message: 'Nouvelle demande d\'achat pour "Pancha-mama"', date: 'Il y a 10 min', read: false, userId: 'u1' },
          { id: 2, type: 'question', message: 'Un utilisateur a posé une question sur votre profil', date: 'Il y a 1h', read: false, userId: 'u1' },
          { id: 3, type: 'info', message: 'Votre compte a été vérifié avec succès', date: 'Hier', read: true, userId: 'u1' }
        ])
      })
      .catch((err) => console.error('Erreur notifications:', err))
      .finally(() => setLoading(false))
  }, [])

  const unreadCount = list.filter((n) => !n.read).length

  const handleMarkAllRead = async () => {
    try {
      await markAllNotifsRead()
      setList(prev => prev.map((n) => ({ ...n, read: true })))
    } catch (err) {
      console.error(err)
    }
  }

  const handleReadSingle = async (id: number) => {
    // Si c'est déjà lu, inutile de re-déclencher un appel API
    const target = list.find(n => n.id === id)
    if (target?.read) return

    try {
      await markNotifRead(id)
      setList(prev => prev.map((n) => n.id === id ? { ...n, read: true } : n))
    } catch (err) {
      console.error(err)
    }
  }

  // Mappage humain des icônes sémantiques du projet (Adieu les coordonnées complexes)
  const getIconConfig = (type: Notification['type']) => {
    const configs = {
      achat: { bg: 'bg-green-50 text-green-600', icon: Icons.ShieldCheckIcon },
      question: { bg: 'bg-[#FAECE7] text-[#E2725B]', icon: Icons.ChatBubbleLeftRightIcon },
      news: { bg: 'bg-blue-50 text-blue-500', icon: Icons.NewspaperIcon },
      info: { bg: 'bg-gray-50 text-gray-500', icon: Icons.InformationCircleIcon }
    }
    return configs[type] || configs.info
  }

  if (loading) {
    return <div className="text-xs font-mono text-gray-400 py-4">Mise à jour de la boîte de réception...</div>
  }

  return (
    <div className="w-full max-w-xl flex flex-col gap-6 font-sans">
      
      {/* En-tête de section */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-2">
          <h2 className="text-lg font-serif italic font-medium pb-1.5 border-b-2 border-[#E2725B]">
            Notifications
          </h2>
          {unreadCount > 0 && (
            <span className="text-xs font-bold text-[#E2725B] font-mono">({unreadCount})</span>
          )}
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllRead} 
            className="text-xs text-gray-400 hover:text-[#E2725B] transition cursor-pointer"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Liste des notifications */}
      <div className="flex flex-col gap-3">
        {list.length === 0 ? (
          <p className="text-xs text-gray-400 italic text-center py-6">Aucune notification pour le moment.</p>
        ) : (
          list.map((n) => {
            const cfg = getIconConfig(n.type)
            const IconComponent = cfg.icon
            
            return (
              <div
                key={n.id}
                onClick={() => handleReadSingle(n.id)}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  !n.read 
                    ? 'border-[#E2725B]/20 bg-[#FAECE7]/25 shadow-2xs' 
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${cfg.bg}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <p className="text-xs text-gray-700 leading-relaxed font-medium">{n.message}</p>
                  <span className="text-[10px] text-gray-400 font-mono">{n.date}</span>
                </div>

                {!n.read && (
                  <div className="w-2 h-2 rounded-full bg-[#E2725B] shrink-0 mt-2 animate-pulse" />
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
