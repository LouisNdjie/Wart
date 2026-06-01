// layouts/MainLayout.tsx
import { Navigate, Outlet } from 'react-router-dom'
import Navbar from '../Components/navbar'
import Footer from '../Components/footer'
import  useAuth from '../hooks/useAuth'


export default function MainLayout() {
  const { isLoggedIn, loading } = useAuth()

  // Écran d'attente pendant la validation de la session
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="w-5 h-5 rounded-full border-2 border-[#E2725B] border-t-transparent animate-spin" />
      </div>
    )
  }

  // Redirection forcée si le user a pas de token actif
  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
