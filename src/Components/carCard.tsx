
interface CarouselCardProps {
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
}

const CarouselCard = ({
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
}: CarouselCardProps) => {
  return (
    <div
      onClick={onClick}
      className="min-w-175 rounded-xl border border-gray-100 overflow-hidden shrink-0 cursor-pointer hover:border-gray-400 transition bg-white"
    >
      {/* image de l'oeuvre */}
      <div className="h-52 w-full overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
            FUCK ENSPY
          </div>
        )}
      </div>

      {/*informations de l'oeuvre*/}
      <div className="p-3 flex items-start justify-between gap-3">

        {/* titre et description */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 underline underline-offset-2 decoration-1 truncate italic">
            {title}
          </p>
          {description && (
            <p className="mt-1 text-xs text-gray-600 leading-relaxed line-clamp-4 whitespace-pre-line">
              {description}
            </p>
          )}
        </div>

        {/*avatar et statistiques */}
        <div className="flex flex-col items-end gap-2 shrink-0">

          {/* Avatar de l'artiste et nom */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
              {artistAvatar ? (
                <img src={artistAvatar} alt={artistName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                  {artistName?.[0] ?? '?'}
                </div>
              )}
            </div>
            <div className="text-right">
              {artistName && (
                <p className="text-xs font-medium text-gray-800 leading-tight">{artistName}</p>
              )}
              {artistHandle && (
                <p className="text-[10px] text-gray-500 leading-tight">{artistHandle}</p>
              )}
            </div>
          </div>

          {/* statistiques*/}
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <StatItem icon={<EyeIcon />} count={views} />
            <StatItem icon={<CommentIcon />} count={comments} />
            <StatItem icon={<HeartIcon />} count={likes} />
          </div>

        </div>
      </div>
    </div>
  )
}

//Statistiques de l'oeuvre
const StatItem = ({ icon, count }: { icon: React.ReactNode; count: number }) => (
  <span className="flex items-center gap-0.5">
    {icon}
    {count}
  </span>
)

// icones personnalisées
const EyeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const CommentIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const HeartIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

export default CarouselCard