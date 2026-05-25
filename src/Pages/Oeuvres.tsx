import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../Components/button'
import  ModalAchat  from '../Components/modal'

// ── TYPES ──
type Statut = 'Disponible' | 'Réservée' | 'Vendue'

interface Commentaire {
  id: number
  auteur: string
  initiale: string
  date: string
  message: string
}

// ── DONNÉES SIMULÉES ──
const OEUVRE = {
  id: 1,
  titre: 'Inside Pancha-mama',
  artiste: 'Sandra Vasquez de la Horra',
  artisteHandle: '@s.vasquez',
  annee: 2024,
  dimensions: '120 × 90 cm',
  medium: 'Aquarelle sur papier',
  statut: 'Disponible' as Statut,
  prix: 4800,
  likes: 47,
  description:
    "Une exploration des mythes ancestraux andins, où les formes organiques s'entremêlent pour évoquer la Pachamama — la Terre-Mère — dans toute sa puissance symbolique. L'œuvre convoque un imaginaire à la frontière du rêve et du rituel.",
  imageColor: 'linear-gradient(135deg, #c8b89a, #d4956a, #b8845a)',
  collection: 'Expositions',
}

const COMMENTAIRES: Commentaire[] = [
  { id: 1, auteur: 'Marie L.', initiale: 'M', date: '14 avr. 2026', message: "Une œuvre d'une rare intensité. Les formes semblent vivre et respirer." },
  { id: 2, auteur: 'Thomas R.', initiale: 'T', date: '10 avr. 2026', message: "Le travail de l'aquarelle est saisissant. J'ai rarement vu une telle maîtrise du médium." },
  { id: 3, auteur: 'Aïcha D.', initiale: 'A', date: '3 avr. 2026', message: "Cette pièce m'a transportée. Le symbolisme andin est traité avec une immense sensibilité." },
]

// ── STATUT BADGE ──
const statutConfig: Record<Statut, { bg: string; text: string; dot: string }> = {
  Disponible: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-400' },
  Réservée:   { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  Vendue:     { bg: 'bg-gray-100', text: 'text-gray-500',  dot: 'bg-gray-400' },
}

const StatutBadge = ({ statut }: { statut: Statut }) => {
  const s = statutConfig[statut]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {statut}
    </span>
  )
}



// ── PAGE ──
const Oeuvres = () => {
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(OEUVRE.likes)
  const [commentaires, setCommentaires] = useState(COMMENTAIRES)
  const [newComment, setNewComment] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [zoom, setZoom] = useState(false)

  const handleLike = () => {
    setLiked((prev) => !prev)
    setLikes((prev) => prev + (liked ? -1 : 1))
  }

  const handleComment = () => {
    if (!newComment.trim()) return
    setCommentaires((prev) => [
      {
        id: Date.now(),
        auteur: 'Vous',
        initiale: 'V',
        date: "À l'instant",
        message: newComment.trim(),
      },
      ...prev,
    ])
    setNewComment('')
  }

  return (
    <div className="min-h-screen px-6 sm:px-10 pt-28 pb-20 max-w-5xl mx-auto">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* ── COLONNE GAUCHE : IMAGE ── */}
        <div className="flex flex-col gap-4">

          {/* Vitrine */}
          <div
            className="relative rounded-2xl overflow-hidden border border-gray-100 cursor-zoom-in"
            style={{ aspectRatio: '4/5' }}
            onClick={() => setZoom(true)}
          >
            <div
              className="w-full h-full"
              style={{ background: OEUVRE.imageColor }}
            />
            {/* Bouton plein écran */}
            <button
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:bg-white transition"
              onClick={(e) => { e.stopPropagation(); setZoom(true) }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </button>
            <StatutBadge statut={OEUVRE.statut} />
          </div>

          {/* Like */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all duration-200 ${
                liked
                  ? 'bg-[#FAECE7] border-[#E2725B] text-[#993C1D]'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <svg
                width="15" height="15" viewBox="0 0 24 24"
                fill={liked ? '#E2725B' : 'none'}
                stroke={liked ? '#E2725B' : 'currentColor'}
                strokeWidth={1.8}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {likes}
            </button>
            <span className="text-xs text-gray-400">personnes aiment cette œuvre</span>
          </div>
        </div>

        {/* ── COLONNE DROITE : INFOS ── */}
        <div className="flex flex-col gap-6">

          {/* Titre + artiste */}
          <div>
            <h1
              className="text-3xl font-normal text-gray-900 leading-tight"
              style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
            >
              {OEUVRE.titre}
            </h1>
            <button
              onClick={() => navigate(`/artistes/${OEUVRE.id}`)}
              className="mt-2 text-sm text-[#E2725B] hover:underline underline-offset-2"
            >
              {OEUVRE.artiste}
            </button>
          </div>

          {/* Métadonnées de notre oeuvre */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Année', value: OEUVRE.annee },
              { label: 'Médium', value: OEUVRE.medium },
              { label: 'Dimensions', value: OEUVRE.dimensions },
              { label: 'Statut', value: <StatutBadge statut={OEUVRE.statut} /> },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                <div className="text-sm text-gray-800">{value}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed border-l-2 border-[#E2725B]/30 pl-4 italic">
            {OEUVRE.description}
          </p>

          {/* ── ZONE ACHAT ── */}
          <div className="border border-gray-100 rounded-2xl p-5 flex flex-col gap-4">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Prix</p>
                <p className="text-2xl font-light text-gray-900 mt-0.5">
                  {OEUVRE.prix.toLocaleString('fr-FR')} €
                </p>
              </div>
              <StatutBadge statut={OEUVRE.statut} />
            </div>

            {OEUVRE.statut === 'Disponible' && (
              <Button
                label="Faire une demande d'achat"
                size="lg"
                className="w-full text-white bg-[#E2725B] hover:bg-[#c85e48]"
                onClick={() => setModalOpen(true)}
              />

                
              
            )}

            {/* Mentions rassurance */}
            <div className="flex flex-col gap-2.5">
              {[
                { icon: '✦', text: "Certificat d'authenticité inclus" },
                { icon: '⊡', text: 'Livraison sécurisée assurée — devis sur demande' },
                { icon: '◎', text: 'Paiement en plusieurs fois disponible' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-xs text-gray-500">
                  <span className="text-[#E2725B] text-[10px]">{icon}</span>
                  {text}
                </div>
              ))}
            </div>

            <div className="h-px bg-gray-100" />

            {/* Contacter expert */}
            <button className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-[#E2725B] hover:text-[#E2725B] transition-all duration-200">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Contacter un expert / Poser une question
            </button>
          </div>
        </div>
      </div>

      {/* ── COMMENTAIRES ── */}
      <div className="mt-14">
        <h2
          className="inline-block text-xl font-normal pb-2 mb-8 border-b-2 border-[#E2725B]"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Avis & impressions
        </h2>

        {/* Champ nouveau commentaire */}
        <div className="flex gap-3 mb-8">
          <div className="w-9 h-9 rounded-full bg-[#FAECE7] flex items-center justify-center text-xs font-medium text-[#993C1D] shrink-0">
            V
          </div>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleComment()}
              placeholder="Partagez votre impression…"
              className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#E2725B] transition-colors bg-white"
            />
            <button
              onClick={handleComment}
              disabled={!newComment.trim()}
              className="px-4 py-2.5 bg-[#6b7a3e] hover:bg-[#5a6832] disabled:opacity-30 text-white text-sm rounded-xl transition-colors duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Liste commentaires */}
        <div className="flex flex-col gap-4">
          {commentaires.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500 shrink-0">
                {c.initiale}
              </div>
              <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-gray-800">{c.auteur}</span>
                  <span className="text-[10px] text-gray-400">{c.date}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{c.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*MODALE ACHAT */}
      {modalOpen && (
        <ModalAchat oeuvreId={OEUVRE.id} prix={OEUVRE.prix} onClose={() => setModalOpen(false)} />
      )}

      {/* ── ZOOM PLEIN ÉCRAN ── */}
      {zoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setZoom(false)}
        >
          <div
            className="w-[90vw] max-w-3xl rounded-2xl overflow-hidden"
            style={{ aspectRatio: '4/5', background: OEUVRE.imageColor }}
          />
          <button
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"
            onClick={() => setZoom(false)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

    </div>
  )
}

export default Oeuvres