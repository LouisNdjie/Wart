import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: React.ReactNode 
}

export default function InputField({
  label,
  type = 'text',
  placeholder,
  icon,
  className = '', 
  ...rest // pour avoir accès aux autres propriétés
}: InputProps) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      <label className="text-xs text-white/70 tracking-wide font-medium">
        {label}
      </label>
      
      <div className="relative group">
        {icon && (
          <span className="absolute inset-y-0 left-3.5 flex items-center text-white/40 group-focus-within:text-[#E2725B] transition-colors">
            {icon}
          </span>
        )}
        
        <input
          type={type}
          placeholder={placeholder}
          className={`
            w-full py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white 
            placeholder:text-white/30 focus:outline-none focus:border-[#E2725B] transition-colors
            ${icon ? 'pl-10 pr-4' : 'px-4'}
          `}
          {...rest}
        />
      </div>
    </div>
  )
}
