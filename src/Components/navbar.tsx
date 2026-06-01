// Components/Navbar.tsx
import { useEffect, useState, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Menu, MenuButton, MenuItem, MenuItems, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import * as Icons from '@heroicons/react/24/outline'
import useAuth  from '../hooks/useAuth'
import logo from '../assets/wart.svg'

const LINKS = [
  { name: 'Expositions', to: '/', end: true },
  { name: 'Artistes', to: '/artistes' },
  { name: 'Oeuvres', to: '/oeuvres' },
  { name: 'Edito', to: '/edito' },
  { name: 'Galerie', to: '/galerie' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const { isLoggedIn, logout, initials } = useAuth()
  
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInput = useRef<HTMLInputElement>(null)

  // Gestion du scroll 
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) searchInput.current?.focus()
  }, [searchOpen])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Louis c'est toi qu'on attend pour la logique de recherceh
    setSearchOpen(false)
  }

  return (
    <>
      {/* Branding fixe */}
      <div className="fixed top-6 left-8 z-50 cursor-pointer" onClick={() => navigate('/')}>
        <img src={logo} alt="Wart" className="h-14 w-auto" />
      </div>

      {/* Actions (Recherche & Profil) */}
      <div className="fixed top-6 right-8 z-50 flex items-center gap-4">
        
        {/* searchbar*/}
        <div className="relative flex items-center">
          {searchOpen ? (
            <form 
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-xs"
            >
              <input
                ref={searchInput}
                type="text"
                placeholder="Rechercher..."
                className="bg-transparent outline-none text-xs w-36 text-gray-800"
                onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
              />
              <button type="button" onClick={() => setSearchOpen(false)}>
                <Icons.XMarkIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="text-gray-500 hover:text-gray-900 transition p-1"
            >
              <Icons.MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Menu */}
        <Menu as="div" className="relative">
          <MenuButton className="flex items-center justify-center h-9 w-9 rounded-full bg-[#6b7a3e] text-white text-sm font-semibold hover:bg-[#5a6832] transition cursor-pointer">
            {initials || 'U'}
          </MenuButton>

          <MenuItems className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-xl border border-gray-100 py-1 focus:outline-none">
            {isLoggedIn ? (
              <>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => navigate('/profile')}
                      className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 ${active ? 'bg-gray-50' : ''}`}
                    >
                      <Icons.UserIcon className="h-4 w-4 text-gray-400" />
                      Mon profil
                    </button>
                  )}
                </MenuItem>
                <hr className="border-gray-100 my-1" />
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => { logout(); navigate('/auth') }}
                      className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 font-medium ${active ? 'bg-red-50/50' : ''}`}
                    >
                      <Icons.ArrowRightOnRectangleIcon className="h-4 w-4" />
                      Déconnexion
                    </button>
                  )}
                </MenuItem>
              </>
            ) : (
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={() => navigate('/auth')}
                    className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 font-medium ${active ? 'bg-gray-50' : ''}`}
                  >
                    <Icons.ArrowLeftOnRectangleIcon className="h-4 w-4 text-gray-400" />
                    Connexion
                  </button>
                )}
              </MenuItem>
            )}
          </MenuItems>
        </Menu>

        {/* Bouton mobile toggle */}
        <Disclosure as="div" className="sm:hidden flex items-center">
          {({ open }) => (
            <DisclosureButton className="text-gray-500 hover:text-gray-900 p-1">
              {open ? <Icons.XMarkIcon className="h-6 w-6" /> : <Icons.Bars3Icon className="h-6 w-6" />}
            </DisclosureButton>
          )}
        </Disclosure>
      </div>

      {/* Flottant central (Menu principal desktop) */}
      <nav
        className={`fixed top-6 left-1/2 z-40 -translate-x-1/2 px-8 py-2.5 border rounded-xl transition-all duration-300 hidden sm:block ${
          scrolled
            ? 'bg-white/90 border-gray-200 shadow-sm backdrop-blur-md'
            : 'bg-white/50 border-white/40 backdrop-blur-xs'
        }`}
      >
        <div className="flex items-center gap-8">
          {LINKS.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `
                relative text-sm font-medium transition-colors py-1 block group
                ${isActive ? 'text-black' : 'text-gray-400 hover:text-black'}
              `}
            >
              {item.name}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#E2725B] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Menu mobile*/}
      <Disclosure as="div" className="sm:hidden fixed top-20 left-0 right-0 z-30">
        {({ close }) => (
          <DisclosurePanel className="bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-100 px-6 py-4 flex flex-col gap-3">
            {LINKS.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.end}
                onClick={() => close()}
                className={({ isActive }) => `
                  py-2 text-base font-medium border-b border-gray-50 last:border-0
                  ${isActive ? 'text-[#E2725B]' : 'text-gray-600'}
                `}
              >
                {item.name}
              </NavLink>
            ))}
          </DisclosurePanel>
        )}
      </Disclosure>
    </>
  )
}
