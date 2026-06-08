import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


export default function ArtistCard({
  id,
  tag,
  artistName,
  artistHandle,
  artistAvatar,
  artistProfile,
  artistPaints,
  onClick,
  isActive = false,
}: {
  id: number
  tag: string
  artistName: string
  artistHandle: string
  artistAvatar?: string
  artistProfile: string
  artistPaints: string[]
  onClick?: () => void
  isActive?: boolean
}) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)

  const items = artistPaints?.slice(0, 8) || []
  const count = items.length
  
  const zDistance = count > 4 ? 220 : 140

  return (
    <div
      onClick={onClick}
      className={`group bg-white rounded-2xl overflow-hidden cursor-pointer flex flex-col border transition-all duration-300 ${
        isActive
          ? 'border-[#E2725B] shadow-xl scale-[1.01]'
          : 'border-gray-100 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      {/* Container Slider 3D */}
      <div
        className="relative w-full h-80 overflow-hidden bg-[#fafaf8] flex items-center justify-center select-none"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >

        <div
          className="relative preserve-3d transition-transform duration-700"
          style={{
            width: '140px',
            height: '190px',
            transform: `perspective(1000px) rotateX(-6deg)`,
          }}
        >
          <div 
            className="w-full h-full preserve-3d"
            style={{
              animation: `spin ${hovered ? '12s' : '25s'} linear infinite`,
              animationPlayState: hovered ? 'running' : 'running', // Reste actif, modifiable si besoin de pause
            }}
          >
            {items.map((src, idx) => {
              const angle = idx * (360 / count)
              return (
                <div
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/oeuvres/${id}-${idx}`)
                  }}
                  className="absolute inset-0 rounded-xl overflow-hidden bg-gray-100 border border-white/80 shadow-md hover:scale-105 transition-transform duration-200 backface-hidden"
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(${zDistance}px)`,
                  }}
                >
                  {src ? (
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                      {idx + 1}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      
        <div className="absolute inset-x-0 top-0 h-12 bg-linear-to-b from-[#fafaf8] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-[#fafaf8] to-transparent pointer-events-none" />

        {isActive && (
          <span className="absolute top-3 left-3 text-[10px] font-medium px-2.5 py-1 rounded-full bg-[#E2725B] text-white shadow-xs">
            En vue
          </span>
        )}
      </div>

      {/* Détails carte */}
      <div className="p-5 flex flex-col gap-3 bg-white border-t border-gray-50/50">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#FAECE7] border border-gray-100 shrink-0 flex items-center justify-center">
              {artistAvatar ? (
                <img src={artistAvatar} alt={artistName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-[#993C1D]">
                  {artistName?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="truncate">
              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#E2725B] transition-colors truncate leading-tight">
                {artistName}
              </h4>
              <span className="text-[11px] text-gray-400 block mt-0.5">{artistHandle}</span>
            </div>
          </div>

          <div className="text-right shrink-0 flex flex-col items-end gap-1">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#FAECE7] text-[#993C1D]">
              {tag}
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              {count} {count > 1 ? 'oeuvres' : 'oeuvre'}
            </span>
          </div>
        </div>

        {artistProfile && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 border-l-2 border-[#E2725B]/40 pl-3 italic bg-gray-50/50 py-1 rounded-r">
            "{artistProfile}"
          </p>
        )}
      </div>

    </div>
  )
}
