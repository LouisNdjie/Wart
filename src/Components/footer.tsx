import { NavLink } from 'react-router-dom'

// 
const FOOTER_LINKS = [
  {
    title: 'Navigation',
    items: [
      { to: '/', label: 'Accueil' },
      { to: '/about', label: 'À propos' },
      { to: '/contact', label: 'Contact' },
      { to: '/faq', label: 'FAQ' },
    ]
  },
  {
    title: 'Découvrir',
    items: [
      { to: '/edito', label: 'Événements à venir' },
      { to: '/oeuvres', label: 'Ventes aux enchères' },
      { to: '/auth', label: 'Espace membre' },
      { to: '/cgu', label: 'Mentions légales & CGU' },
    ]
  }
]

const SOCIALS = [
  { href: 'https://youtube.com', label: 'YouTube', color: 'hover:text-[#FF0000]' },
  { href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:text-[#0077B5]' },
  { href: 'https://github.com', label: 'GitHub', color: 'hover:text-black' },
  { href: 'https://discord.com', label: 'Discord', color: 'hover:text-[#5865F2]' },
]

export default function Footer() {
  return (
    <footer className="bg-white text-gray-600 border-t border-gray-100 font-sans">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        <div className="md:col-span-2 flex flex-col gap-3">
          <span className="text-3xl font-black tracking-tighter text-gray-900">
            W<span className="text-[#E2725B]">art</span>
          </span>
          <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
            Plateforme d'exposition et de gestion d'oeuvres d'art contemporaines. Rejoignez notre communauté d'artistes.
          </p>
          
          <div className="flex gap-4 mt-2 text-gray-400 text-xs font-medium">
            {SOCIALS.map((soc) => (
              <a 
                key={soc.label} 
                href={soc.href} 
                target="_blank" 
                rel="noreferrer" 
                className={`transition-colors uppercase tracking-wider text-[11px] ${soc.color}`}
              >
                {soc.label}
              </a>
            ))}
          </div>
        </div>

        {FOOTER_LINKS.map((col) => (
          <div key={col.title} className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              {col.title}
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              {col.items.map((link) => (
                <NavLink 
                  key={link.to} 
                  to={link.to} 
                  className="hover:text-[#E2725B] transition-colors text-gray-500 hover:underline underline-offset-4"
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Copyright par Shane SKYWALKER*/}
      <div className="border-t border-gray-50 py-6 text-center text-[11px] text-gray-400 uppercase tracking-widest bg-gray-50/50">
        &copy; {new Date().getFullYear()} Wart &bull; Tous droits réservés
      </div>
    </footer>
  )
}
