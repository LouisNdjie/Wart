import {
  Disclosure, DisclosureButton, DisclosurePanel,
  Menu, MenuButton, MenuItem, MenuItems,
} from '@headlessui/react'

import {
  Bars3Icon, XMarkIcon, MagnifyingGlassIcon,
  UserIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon,ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'
import { useEffect, useState, useRef, useCallback } from 'react'


// Données de navigation
const navigation = [
  { name: 'Expositions', to: '/', end: true },
  { name: 'Artistes', to: '/artistes' },
  { name: 'Oeuvres', to: '/oeuvres' },
  { name: 'Edito', to: '/edito' },
  { name: 'Galerie', to: '/galerie' },
]

interface NavbarProps {
  userInitial?: string
}

const Navbar = ({ userInitial = 'SE' }: NavbarProps) => { //On va construire en fonction des initiales de l'utilisateur
  
  // states pour gérer le scroll et le menu de recherche
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchBlurTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  // Nettoyage du timer au démontage 
  useEffect(() => {
    return () => {
      if (searchBlurTimer.current) clearTimeout(searchBlurTimer.current)
    }
  }, [])

  const closeSearch = useCallback(() => setSearchOpen(false), [])

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeSearch()
  }

  // Délai pour éviter les faux blur (
  const handleSearchBlur = () => {
    searchBlurTimer.current = setTimeout(closeSearch, 150)
  }

  const handleSearchFocus = () => {
    if (searchBlurTimer.current) clearTimeout(searchBlurTimer.current)
  }

  return (
    <>
      {/* LOGO */}
      <div className="fixed top-6 left-8 z-50">
        <img src="../src/assets/Wart.png" alt="Logo" className="h-16 w-auto" />
      </div>

      {/* ACTIONS DROITE */}
      <div className="fixed top-6 right-8 z-50 flex items-center space-x-4">

        {/* SEARCH */}
        <div className="relative">
          {searchOpen ? (
            <div className="flex items-center bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl px-3 py-1 shadow-sm">
              <input
                ref={inputRef}
                type="text"
                placeholder="Rechercher…"
                className="bg-transparent outline-none text-sm w-40"
                onKeyDown={handleSearchKeyDown}
                onBlur={handleSearchBlur}
                onFocus={handleSearchFocus}
              />
              <button
                onMouseDown={(e) => e.preventDefault()} // évite le blur avant le click
                onClick={closeSearch}
                aria-label="Fermer la recherche"
              >
                <XMarkIcon className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="text-gray-600 hover:text-black transition"
              aria-label="Ouvrir la recherche"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* PROFILE MENU */}
        <Menu as="div" className="relative">
          <MenuButton
            className="flex items-center justify-center h-9 w-9 rounded-full bg-[#6b7a3e] text-white text-sm font-medium hover:bg-[#5a6832] transition"
            aria-label="Menu utilisateur"
          >
            {userInitial} {/*on va extraire les initiales du nom de l'utilisateur connecté*/}
          </MenuButton>

          <MenuItems className="absolute right-0 mt-3 w-52 origin-top-right rounded-xl bg-white/90 backdrop-blur-md shadow-lg border border-gray-100 py-1">
            <MenuItem>
              {({ focus }) => (
                <button className={`flex items-center gap-3 w-full px-4 py-2 text-sm ${focus ? 'bg-gray-100' : ''}`}>
                  <UserIcon className="h-4 w-4 text-black" />
                  Mon profil
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <button className={`flex items-center gap-3 w-full px-4 py-2 text-sm ${focus ? 'bg-gray-100' : ''}`}>
                  <Cog6ToothIcon className="h-4 w-4 text-black" />
                  Paramètres
                </button>
              )}
            </MenuItem>
            <div className="border-t my-1" />
            <MenuItem>
              {({ focus }) => (
                <button className={`flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 ${focus ? 'bg-red-50' : ''}`}>
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  Se déconnecter
                </button>
              )}
            </MenuItem>
            <MenuItem>
               {({ focus }) => (
                <button className={`flex items-center gap-3 w-full px-4 py-2 text-sm text-blue-500 ${focus ? 'bg-blue-50' : ''}`}>
                  <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                  Se connecter
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>

        {/* MOBILE BUTTON*/}
        <Disclosure as="div" className="sm:hidden">
          {({ open }) => (
            <DisclosureButton
              className="text-gray-600 hover:text-black"
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {open
                ? <XMarkIcon className="h-6 w-6" />
                : <Bars3Icon className="h-6 w-6" />
              }
            </DisclosureButton>
          )}
        </Disclosure>
      </div>

      {/* NAVBAR DESKTOP */}
      <nav
        className={`fixed top-6 left-1/2 z-40 -translate-x-1/2 px-10 py-3 border transition-all duration-1000 rounded-2xl ${
          scrolled
            ? 'bg-white/80 backdrop-blur-md border-gray-200 shadow-sm'
            : 'bg-white/40 backdrop-blur-sm border-white/30'
        }`}
      >
        <div className="hidden sm:flex items-center justify-center space-x-10">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `relative text-sm tracking-wide transition-colors px-3 duration-300 group outline-none ${
                  isActive ? 'text-black' : 'text-gray-500 hover:text-black'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.name}
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 w-full origin-left transition-transform duration-300 bg-[#E2725B] ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* MOBILE MENU // gars le responsive m'a nack*/} 
      <Disclosure as="div" className="sm:hidden fixed top-24 left-0 right-0 z-30">
        {({ close }) => (
          <DisclosurePanel className="bg-white/90 backdrop-blur-md shadow-md border-t border-gray-100 px-4 pb-4 pt-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.end}
                onClick={() => close()} // ferme le menu au clic
                className={({ isActive }) =>
                  `flex items-center py-2.5 text-base border-b border-gray-50 last:border-0 ${
                    isActive ? 'text-black font-medium' : 'text-gray-500'
                  }`
                }
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

export default Navbar