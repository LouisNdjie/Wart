
type BtnProps = {
  label?: string
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  className?: string 
}

export default function Button({ 
  label = 'Valider', 
  size = 'md', 
  onClick,
  className = ''
}: BtnProps) {
  
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  }

  return (
    <button
      onClick={onClick}
      className={`bg-[#6b7a3e] hover:bg-[#5a6832] text-black font-medium border-2 border-transparent rounded-lg active:border-black transition focus:outline-none focus:ring-2 focus:ring-black ${sizes[size]} ${className}`}
    >
      {label}
    </button>
  )
}
