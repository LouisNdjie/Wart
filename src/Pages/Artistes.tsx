// Pages/Artistes.tsx
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ArtistCard from '../Components/artistCard'
import bgImage from '../assets/bg-artiste.png'
import { getArtistes } from '../api/client'
import type { Artiste } from '../types'

export default function Artistes() {
  const navigate = useNavigate()
  
  const [artists, setArtists] = useState<Artiste[]>([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  // Récupération des données réelles depuis le serveur
    useEffect(() => {
    getArtistes()
      .then(res => {
        const data = res as Artiste[]
        // Données tests comme la bd est vide 
        setArtists(data?.length ? data : [
          { id: 1, tag: 'Peinture', artistName: 'Sandra Vasquez', artistHandle: '@s.vasquez', artistProfile: 'Artiste colombienne.', artistPaints: ['/oeuvres/1.jpg', '/oeuvres/2.jpg'] },
          { id: 2, tag: 'Sculpture', artistName: 'Yayoi Tazong', artistHandle: '@y.tazong', artistProfile: 'Pionnière de l art conceptuel.', artistPaints: ['/oeuvres/5.jpg', '/oeuvres/6.jpg'] },
          { id: 3, tag: 'Photographie', artistName: 'Gordon Parks', artistHandle: '@g.parks', artistProfile: 'Documente les inégalités.', artistPaints: ['/oeuvres/8.jpg'] },
          { id: 4, tag: 'Installation', artistName: 'Kara Walker', artistHandle: '@k.walker', artistProfile: 'Silhouettes en papier noir.', artistPaints: ['/oeuvres/10.jpg'] },
        ])
      })
      .catch(err => console.error('Erreur artistes:', err))
      .finally(() => setLoading(false))
  }, [])


  // Un seul observer global sur le défilement des éléments de la page
  useEffect(() => {
    if (loading || !cardRefs.current.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.indexOf(entry.target as HTMLDivElement)
            if (index !== -1) setActiveIdx(index)
          }
        })
      },
      { threshold: 0.3, rootMargin: '-25% 0px -25% 0px' }
    )

    cardRefs.current.forEach(ref => ref && observer.observe(ref))
    return () => observer.disconnect()
  }, [loading, artists])

  // Barre de progression simplifiée
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total <= 0) return
      setScrollProgress((window.scrollY / total) * 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (loading) {
    return <div className="p-8 text-xs font-mono text-gray-400">Chargement de la galerie d'artistes...</div>
  }

  return (
    <div 
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Tracker de scroll */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-gray-200/20">
        <div className="h-full bg-[#E2725B] transition-all" style={{ width: `${scrollProgress}%` }} />
      </div>

      <div className="min-h-screen bg-white/70 backdrop-blur-xs pt-28 pb-20">
        
        {/* Navigation latérale épurée (Moins de gadgets visuels superflus) */}
        <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2">
          {artists.map((artist, idx) => (
            <button
              key={artist.id}
              onClick={() => cardRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              className="group flex items-center gap-3 py-1.5 text-left cursor-pointer"
            >
              <div className={`h-px transition-all rounded-full ${
                idx === activeIdx ? 'w-6 bg-[#E2725B]' : 'w-3 bg-gray-400 hover:bg-gray-600'
              }`} />
              <span className={`text-[10px] uppercase font-bold tracking-wider transition-colors ${
                idx === activeIdx ? 'text-[#E2725B]' : 'opacity-0 group-hover:opacity-60 text-gray-500'
              }`}>
                {artist.artistName}
              </span>
            </button>
          ))}
        </nav>

        {/* Conteneur principal de défilement */}
        <div className="flex flex-col gap-12 w-full max-w-xl mx-auto px-6">
          {artists.map((artist, idx) => (
            <div
              key={artist.id}
              ref={el => { cardRefs.current[idx] = el }}
              className="transition-all duration-500 flex flex-col gap-2"
              style={{
                opacity: idx === activeIdx ? 1 : 0.6,
                transform: idx === activeIdx ? 'scale(1)' : 'scale(0.98)'
              }}
            >
              {/* Séparateur minimaliste */}
              <div className="flex items-center gap-3 text-gray-400/60 text-[11px] font-mono">
                <span>{String(idx + 1).padStart(2, '0')}</span>
                <hr className="flex-1 border-gray-200" />
                <span className="text-[10px] uppercase tracking-wide">{artist.tag}</span>
              </div>

              <ArtistCard
                id={artist.id}
                tag={artist.tag}
                artistName={artist.artistName}
                artistHandle={artist.artistHandle}
                artistAvatar={artist.artistAvatar}
                artistProfile={artist.artistProfile}
                artistPaints={artist.artistPaints}
                isActive={idx === activeIdx}
                onClick={() => navigate(`/artistes/${artist.id}`)}
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
