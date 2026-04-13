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
        py-2 px-4 rounded-lg
        border-2 border-transparent
        active:border-black
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black
        transition-colors duration-200
        cursor-pointer
      "
    >
      {label}
    </button>
  )
}

export default Button