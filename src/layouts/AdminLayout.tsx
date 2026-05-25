// layouts/AdminLayout.tsx
import { useState } from 'react'
import { NavLink, Outlet, useLocation, Navigate } from 'react-router-dom'
import * as Icons from '@heroicons/react/24/outline'
import logo from '../assets/wart.svg'

// Déclaration d'un type propre pour nettoyer les erreurs d'inférence de tableau
type AdminLink = {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  end?: boolean
  badge?: number
  btn?: { text: string; url: string }
}

// On applique le type sur notre tableau de configuration
const SECTIONS: { name: string; links: AdminLink[] }[] = [
  {
    name: 'Principal',
    links: [
      { to: '/admin', label: 'Dashboard', icon: Icons.Squares2X2Icon, end: true, btn: { text: 'Nouvelle oeuvre', url: '/admin/oeuvres/new' } },
      { to: '/admin/oeuvres', label: 'Œuvres', icon: Icons.PhotoIcon, btn: { text: 'Ajouter une œuvre', url: '/admin/oeuvres/new' } },
      { to: '/admin/artistes', label: 'Artistes', icon: Icons.PaintBrushIcon, btn: { text: 'Ajouter un artiste', url: '/admin/artistes/new' } },
      { to: '/admin/collectionneurs', label: 'Collectionneurs', icon: Icons.UsersIcon, btn: { text: 'Ajouter un collectionneur', url: '/admin/collectionneurs/new' } },
    ],
  },
  {
    name: 'Contenu',
    links: [
      { to: '/admin/moderation', label: 'Modération', icon: Icons.ShieldCheckIcon, badge: 4, btn: { text: 'Exporter', url: '/admin/oeuvres/new' } },
      { to: '/admin/edito', label: 'Édito', icon: Icons.NewspaperIcon, btn: { text: 'Nouvel article', url: '/admin/edito/new' } },
      { to: '/admin/expositions', label: 'Expositions', icon: Icons.BuildingLibraryIcon, btn: { text: 'Nouvelle exposition', url: '/admin/expositions/new' } },
    ],
  },
  {
    name: 'Système',
    links: [
      { to: '/admin/parametres', label: 'Paramètres', icon: Icons.Cog6ToothIcon },
    ],
  },
]

export default function AdminLayout() {
  const isAdmin = !!localStorage.getItem('wart_admin_token')
  const [menuOpen, setMenuOpen] = useState(true)
  const { pathname } = useLocation()

  if (!isAdmin) return <Navigate to="/admin/login" replace />

  const activeLink = SECTIONS.flatMap(s => s.links).find(l => l.to === pathname)
  const btnText = activeLink?.btn?.text || 'Nouveau'
  const btnUrl = activeLink?.btn?.url || '/admin/oeuvres/new'

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className={`bg-white border-r border-gray-100 flex flex-col shrink-0 transition-all ${menuOpen ? 'w-56' : 'w-0 overflow-hidden'}`}>
        <div className="p-5 border-b border-gray-100">
          <img src={logo} alt="Wart" className="h-8" />
          <span className="text-[10px] text-gray-400 block mt-1 uppercase tracking-wider font-semibold">Administration</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-4">
          {SECTIONS.map((section) => (
            <div key={section.name}>
              <h4 className="px-5 text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                {section.name}
              </h4>
              
              <div className="space-y-0.5">
                {section.links.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-5 py-2.5 text-sm font-medium border-l-2 transition-colors
                        ${isActive 
                          ? 'border-[#E2725B] bg-[#FAECE7] text-[#993C1D]' 
                          : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                      `}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="mr-auto">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#FAECE7] text-[#993C1D]">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Profil footer */}
        <div className="p-4 border-t border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <div className="w-8 h-8 rounded-full bg-[#FAECE7] flex items-center justify-center text-xs font-bold text-[#993C1D]">
            A
          </div>
          <div>
            <h5 className="text-xs font-semibold text-gray-900 leading-none">Admin</h5>
            <span className="text-[10px] text-gray-400 block mt-1">Super admin</span>
          </div>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-5 shrink-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-400 hover:text-gray-600 transition p-1"
          >
            {menuOpen ? <Icons.XMarkIcon className="h-5 w-5" /> : <Icons.Bars3Icon className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition relative">
              <Icons.BellIcon className="h-4 w-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#E2725B]" />
            </button>
            
            <NavLink
              to={btnUrl}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#E2725B] hover:bg-[#c85e48] text-white text-xs font-medium rounded-xl transition"
            >
              <Icons.PlusIcon className="h-3.5 w-3.5" />
              {btnText}
            </NavLink>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
