interface ButtonProps {
  label?: string
  onClick?: () => void
}

const Button = ({ label = 'Bouton', onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="
        bg-[#6b7a3e] hover:bg-[#5a6832]
        text-black font-medium
        border-2 border-transparent
        py-2 px-4 rounded-lg
        active:border-black
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black
        
      "
    >
      {label}
    </button>
  )
}

export default Button