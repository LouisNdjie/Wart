// components/CarouselCard.tsx
const Icon = ({ name }: { name: 'eye' | 'msg' | 'heart' }) => {
  const paths = {
    eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    msg: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'
  }
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="inline-block">
      <path d={paths[name]} />
    </svg>
  )
}

export default function CarouselCard({
  title,
  description,
  imageUrl,
  artistName,
  artistAvatar,
  artistHandle,
  views = 0,
  comments = 0,
  likes = 0,
  onClick,
}: {
  title: string
  description?: string
  imageUrl?: string
  artistName?: string
  artistAvatar?: string
  artistHandle?: string
  views?: number
  comments?: number
  likes?: number
  onClick?: () => void
}) {
  
  const stats = [
    { key: 'eye', count: views },
    { key: 'msg', count: comments },
    { key: 'heart', count: likes }
  ] as const

  return (
    <div
      onClick={onClick}
      className="min-w-85 w-85 bg-white rounded-xl border border-gray-100 overflow-hidden shrink-0 cursor-pointer hover:border-gray-300 hover:shadow-sm transition"
    >
      <div className="h-48 w-full bg-gray-50 overflow-hidden border-b border-gray-100">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
            Aucun visuel
          </div>
        )}
      </div>

      <div className="p-4 flex gap-4 items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 truncate italic underline underline-offset-4 decoration-gray-200">
            {title}
          </h4>
          {description && (
            <p className="mt-1.5 text-xs text-gray-500 leading-relaxed line-clamp-3 whitespace-pre-line">
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="text-right min-w-0">
              <span className="block text-xs font-medium text-gray-800 truncate leading-none">{artistName || 'Anonyme'}</span>
              <span className="block text-[10px] text-gray-400 mt-0.5 leading-none">{artistHandle}</span>
            </div>
            
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
              {artistAvatar ? (
                <img src={artistAvatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[11px] font-bold text-gray-400 uppercase">{artistName?.[0] || '?'}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
            {stats.map(s => (
              <span key={s.key} className="flex items-center gap-1">
                <Icon name={s.key} />
                {s.count}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
