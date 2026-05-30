// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthProvider  from './context/AuthContext'

// Layouts
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

// Pages utilisateurs
import Home from './Pages/Home'
import Artistes from './Pages/Artistes'
import Oeuvres from './Pages/Oeuvres'
import Edito from './Pages/Edito'
import Galerie from './Pages/Galerie'
import AuthPage from './Pages/AuthPage'
import Profile from './Pages/Profile'

// Pages admin
import AdminLogin from './Pages/admin/AdminLogin'
import Dashboard from './Pages/admin/Dashboard'
import Moderation from './Pages/admin/Moderation'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Page d'auth — pas de navbar ni footer */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Interface utilisateur */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="artistes" element={<Artistes />} />
            <Route path="artistes/:id" element={<Artistes />} />
            <Route path="oeuvres" element={<Oeuvres />} />
            <Route path="oeuvres/:id" element={<Oeuvres />} />
            <Route path="edito" element={<Edito />} />
            <Route path="galerie" element={<Galerie />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Login admin hors layout admin pour ne pas avoir la sidebar */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Interface admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="moderation" element={<Moderation />} />
            {/* Perr je vais ajouter ça after*/}
            {/* <Route path="oeuvres" element={<AdminOeuvres />} /> */}
            {/* <Route path="artistes" element={<AdminArtistes />} /> */}
            {/* <Route path="collectionneurs" element={<AdminCollectionneurs />} /> */}
            {/* <Route path="edito" element={<AdminEdito />} /> */}
            {/* <Route path="expositions" element={<AdminExpositions />} /> */}
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
