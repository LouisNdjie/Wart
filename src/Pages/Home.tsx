import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import heroBg from '../assets/bg-expo.webp'
import CarouselCard from '../Components/carCard'

interface Exposition {
  id: number
  title: string
  description: string
  dates: string
  tag: string
  imageUrl: string
  artistName: string
  artistHandle: string
  artistAvatar?: string
  views: number
  comments: number
  likes: number
}

const enCours: Exposition[] = [
  {
    id: 1,
    title: 'Formes Vivantes',
    description: 'Lorem ipsum dolor\nsit amet, consectetur\nadipiscing elit.',
    dates: '13 jan – 3 mar 2026',
    tag: 'Peinture',
    imageUrl: '/images/formes-vivantes.jpg',
    artistName: 'Sandra Vasquez',
    artistHandle: '@s.vasquez',
    views: 10, comments: 4, likes: 18,
  },
  {
    id: 2,
    title: 'Éclats de lumière',
    description: 'Nam elementum massa\nac purus volutpat iaculis.',
    dates: '23 jan – 15 avr 2026',
    tag: 'Sculpture',
    imageUrl: '',
    artistName: 'The Weeknd',
    artistHandle: '@The_weeknd',
    views: 10, comments: 10, likes: 10,
  },
  {
    id: 3, title: 'Corps & Territoire', description: 'Sed ut perspiciatis\nunde omnis iste natus.',
    dates: '1 fév – 30 avr 2026', tag: 'Photographie', imageUrl: '',
    artistName: 'Yayoi TAZONG', artistHandle: '@y.tazong',
    views: 24, comments: 6, likes: 31,
  },
  {
    id: 4, title: 'Mémoire collective', description: 'At vero eos et accusamus\net iusto odio dignissimos.',
    dates: '5 fév – 10 mai 2026', tag: 'Installation', imageUrl: '',
    artistName: 'Kara Walker', artistHandle: '@k.walker',
    views: 15, comments: 3, likes: 22,
  },
  {
    id: 5, title: 'Résonances', description: 'Quis autem vel eum\niure reprehenderit.',
    dates: '15 fév – 20 mai 2026', tag: 'Art sonore', imageUrl: '',
    artistName: 'Shane', artistHandle: '@shane',
    views: 8, comments: 2, likes: 14,
  },
]

const archives = [
  { id: 6, title: 'Terres Brûlées', dates: '2024', imageUrl: '#ede8dc' },
  { id: 7, title: 'Lignes de fuite', dates: '2024', imageUrl: '#e0e8f0' },
  { id: 8, title: 'Strates', dates: '2023', imageUrl: '#eee8f2' },
  { id: 9, title: 'Orgasmes', dates: '2023', imageUrl: '#e2f0e8' },
  { id: 10, title: 'Fellation', dates: '2022', imageUrl: '#f2ece0' },
  { id: 11, title: 'luxure', dates: '2022', imageUrl: '#e8f0f5' },
]

//titre de section
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="inline-block  text-xl font-medium pb-2 mb-8 border-b-2 border-[#E2725B]">
    {children}
  </h2>
)

//carrousel
const CARD_W = 716 // largeur totale d'une carte (incluant le margin)
const AUTO_DELAY = 3500 // ms entre chaque slide auto

const Carousel = ({ items }: { items: Exposition[] }) => {
  // Références et états pour le carrousel
  const trackRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const navigate = useNavigate()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  //nombre de cartes visibles
  const getVisible = () => {
    if (!trackRef.current?.parentElement) return 1
    return Math.max(1, Math.floor(trackRef.current.parentElement.offsetWidth / CARD_W))
  }

  const getMax = () => Math.max(0, items.length - getVisible())

  //Slide vers une position donnée
  const slideTo = useCallback((next: number) => {
    if (!trackRef.current) return
    setPos(next)
    trackRef.current.style.transform = `translateX(-${next * CARD_W}px)`
  }, [])

  const slide = (dir: number) => {
    const max = getMax()
    const next = Math.max(0, Math.min(pos + dir, max))
    slideTo(next)
  }

  //défilement auto
  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setPos((current) => {
        const max = getMax()
        const next = current >= max ? 0 : current + 1
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(-${next * CARD_W}px)`
        }
        return next
      })
    }, AUTO_DELAY)
  }, [])

  useEffect(() => {
    if (!isPaused) startInterval()
    else if (intervalRef.current) clearInterval(intervalRef.current)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPaused, startInterval])

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── TRACK ── */}
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-4 transition-transform duration-500 ease-in-out justify-center"
        >
          {items.map((expo) => (
            <CarouselCard
              key={expo.id}
              title={expo.title}
              description={expo.description}
              imageUrl={expo.imageUrl}
              artistName={expo.artistName}
              artistHandle={expo.artistHandle}
              artistAvatar={expo.artistAvatar}
              views={expo.views}
              comments={expo.comments}
              likes={expo.likes}
              onClick={() => navigate(`/expositions/${expo.id}`)}
            />
          ))}
        </div>
      </div>

      {/*gestionnaire du carrousel*/}
      <button
        onClick={() => slide(-1)}
        disabled={pos === 0}
        aria-label="Précédent"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10
          w-8 h-8 rounded-full bg-white border border-gray-200
          flex items-center justify-center
          disabled:opacity-30 hover:bg-gray-50 transition"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={() => slide(1)}
        disabled={pos >= getMax()}
        aria-label="Suivant"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10
          w-8 h-8 rounded-full bg-white border border-gray-200
          flex items-center justify-center
          disabled:opacity-30 hover:bg-gray-50 transition"
      >
        <ChevronRight />
      </button>

      {/*indicateurs du carrousel*/}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: getMax() + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => slideTo(i)}
            aria-label={`Aller à la position ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === pos
                ? 'w-5 h-2 bg-[#E2725B]'
                : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

    </div>
  )
}

const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
) // tcholeka
const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M9 18l6-6-6-6" />
  </svg>
)

// vif du sujet
const Home = () => {
  return (
    <div className="text-black">

      {/*première section*/}
      <section
        className="w-full h-screen bg-cover bg-center relative"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-8 left-8 z-10">
          <p className="italic text-lg text-white drop-shadow">Inside Pancha-mama</p>
          <p className="italic text-sm text-white/80 mt-1 drop-shadow">
            une oeuvre de Sandra Vasquez de la Horra
          </p>
        </div>
      </section>

      {/* deuxième section — En cours */}
      <section className="px-8 py-12">
        <SectionTitle>En cours</SectionTitle>
        <Carousel items={enCours} />
      </section>

      {/* troisième section — Archive */}
      <section className="px-8 pb-16">
        <SectionTitle>Archive</SectionTitle>
        <div className="grid grid-cols-4 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {archives.map((expo) => (
            <div
              key={expo.id}
              className="rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:border-gray-300 transition"
            >
              <div
                className="h-28"
                style={{ background: expo.imageUrl }}
              />
              <div className="p-2.5">
                <p className="text-xs font-medium text-gray-900">{expo.title}</p>
                <span className="text-xs text-gray-500">{expo.dates}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default Home;