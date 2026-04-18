import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface ArtistCardProps {
  id: number
  tag: string
  artistName: string
  artistHandle: string
  artistAvatar?: string
  artistProfile: string
  artistPaints: string[]
  onClick?: () => void
}

const ArtistCard = ({
  id,
  tag,
  artistName,
  artistHandle,
  artistAvatar,
  artistProfile,
  artistPaints,
  onClick,
}: ArtistCardProps) => {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)

  const paints = artistPaints.slice(0, 8)
  const quantity = paints.length
  const radius = quantity > 4 ? 220 : 150

  return (
    <div
      onClick={onClick}
      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:border-gray-300 transition-all duration-500 flex flex-col p-"
    >

      {/*TCHOLEKA*/}
      <div
        className="relative w-full overflow-hidden bg-[#fafaf8] flex items-center justify-center"
        style={{ height: '340px' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <style>{`
          @keyframes rotate3D-${id} {
            from { transform: perspective(1200px) rotateX(-5deg) rotateY(0deg); }
            to   { transform: perspective(1200px) rotateX(-5deg) rotateY(360deg); }
          }
          .slider-track-${id} {
            animation: rotate3D-${id} ${hovered ? '12s' : '25s'} linear infinite;
            transform-style: preserve-3d;
          }
          .slider-track-${id}:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div
          className={`slider-track-${id} relative`}
          style={{ width: '140px', height: '190px' }}
        >
          {paints.map((src, i) => (
            <div
              key={i}
              onClick={(e) => { e.stopPropagation(); navigate(`/oeuvres/${id}-${i}`) }}
              className="absolute inset-0 hover:scale-105 transition-transform duration-300"
              style={{
                transform: `rotateY(${i * (360 / quantity)}deg) translateZ(${radius}px)`,
                backfaceVisibility: 'hidden',
              }}
            >
              <div className="w-full h-full rounded-xl overflow-hidden border border-white/60"
                style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                {src ? (
                  <img src={src} alt={`Oeuvre ${i + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                    {i + 1}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-[#fafaf8] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#fafaf8] to-transparent z-10 pointer-events-none" />
      </div>

      {/*INFOS*/}
      <div className="px-5 pt-4 pb-5 bg-white border-t border-gray-50">

        {/*Avatar nom tag*/}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-100 shrink-0">
              {artistAvatar ? (
                <img src={artistAvatar} alt={artistName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#FAECE7] flex items-center justify-center text-sm font-medium text-[#993C1D]">
                  {artistName[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 group-hover:text-[#E2725B] transition-colors duration-300 leading-tight">
                {artistName}
              </p>
              <p className="text-[11px] text-gray-400 leading-tight mt-0.5">{artistHandle}</p>
            </div>
          </div>
              {/*tag et quantité*/}
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#FAECE7] text-[#993C1D]">
              {tag}
            </span>
            <span className="text-[10px] text-gray-400">
              {quantity} oeuvre{quantity > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/*BIO*/}
        {artistProfile && (
          <p className="mt-4 text-xs text-gray-400 leading-relaxed line-clamp-2 border-l-2 border-[#E2725B]/30 pl-3 italic">
            {artistProfile}
          </p>
        )}

      </div>
    </div>
  )
}

export default ArtistCard