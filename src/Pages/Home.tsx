import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Icons from '@heroicons/react/24/outline'
import { getExpositions } from '../api/client'
import CarouselCard from '../Components/carCard' 
import type { Exposition } from '../types'
import heroBg from '../assets/bg-expo.webp'



export default function Home() {
  const navigate = useNavigate()
  const scrollTrack = useRef<HTMLDivElement>(null)
  
  const [expos, setExpos] = useState<Exposition[]>()
  const [loading, setLoading] = useState(true)

  // Chargement 
    useEffect(() => {
    getExpositions('en_cours')
      .then(res => {
        const data = res as Exposition[]
        setExpos(data?.length ? data : [
          {
            id: 5, 
            title: 'Résonances', 
            description: 'Une exploration immersive des mythes sonores.',
            dates: '15 fév – 20 mai 2026', 
            tag: 'Art sonore', 
            imageUrl: '',
            artistName: 'Shane', 
            artistHandle: '@shane', 
            views: 8, 
            comments: 2, 
            likes: 14,
            statut: 'en_cours'
          }
        ])
      })
      .catch(err => console.error('Erreur expo home:', err))
      .finally(() => setLoading(false))
  }, [])


  const handleScroll = (direction: number) => {
    scrollTrack.current?.scrollBy({ left: direction * 360, behavior: 'smooth' })
  }

  if (loading) {
    return <div className="p-8 text-xs font-mono text-gray-400">Chargement des expositions...</div>
  }

  return (
    <div className="text-black font-sans flex flex-col gap-12 -mt-24">
      
      {/* Héro*/}
      <section 
        className="w-full h-screen bg-cover bg-center relative flex items-end p-8"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />
        <div className="relative z-10 text-white bg-black/20 backdrop-blur-xs p-4 rounded-xl border border-white/10 max-w-sm">
          <p className="italic text-base font-semibold drop-shadow">Inside Pancha-mama</p>
          <span className="block italic text-xs text-white/80 mt-0.5 drop-shadow">
            Une oeuvre de Sandra Vasquez de la Horra
          </span>
        </div>
      </section>

      {/* Section en cours */}
      <section className="px-6 relative group">
        <h2 className="inline-block text-lg font-serif italic font-medium pb-1.5 border-b-2 border-[#E2725B] mb-6">
          En cours
        </h2>

        <div className="relative w-full">
          {/* Track horizontal défilant nativement */}
          <div
            ref={scrollTrack}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 scrollbar-none"
          >
            {expos?.map((expo) => (
              <div key={expo.id} className="snap-start shrink-0">
                <CarouselCard {...expo} onClick={() => navigate(`/oeuvres/${expo.id}`)} />
              </div>
            ))}
          </div>

          <button
            onClick={() => handleScroll(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 border border-gray-100 shadow-md hover:bg-white transition flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <Icons.ChevronLeftIcon className="h-4 w-4 text-gray-600" />
          </button>

          <button
            onClick={() => handleScroll(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 border border-gray-100 shadow-md hover:bg-white transition flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <Icons.ChevronRightIcon className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </section>

      {/* Section archive */}
      <section className="px-6 pb-16">
        <h2 className="inline-block text-lg font-serif italic font-medium pb-1.5 border-b-2 border-[#E2725B] mb-6">
          Archives
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { id: 11, title: 'Luxure', dates: '2022', color: 'bg-stone-100' },
            { id: 12, title: 'Strates Éphémères', dates: '2023', color: 'bg-zinc-100' }
          ].map((archive) => (
            <div
              key={archive.id}
              className="group rounded-xl border border-gray-100 overflow-hidden bg-white shadow-xs hover:border-gray-300 hover:shadow-md transition flex flex-col cursor-pointer"
            >
              <div className={`h-32 w-full transition-transform duration-300 group-hover:scale-[1.02] ${archive.color}`} />
              <div className="p-4 flex flex-col gap-1 border-t border-gray-50 bg-white">
                <span className="text-sm font-semibold text-gray-900 group-hover:text-[#E2725B] transition-colors">
                  {archive.title}
                </span>
                <span className="text-xs text-gray-400 font-mono">{archive.dates}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
