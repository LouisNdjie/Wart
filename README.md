# Wart — Documentation technique

## Structure des fichiers

```
src/
├── api/
│   └── client.ts          ← Tous les appels HTTP vers FastAPI
├── context/
│   └── AuthContext.tsx    ← État global de l'utilisateur connecté
├── types/
│   └── index.ts           ← Interfaces TypeScript partagées
├── layouts/
│   ├── MainLayout.tsx     ← Navbar + Footer + guard isLoggedIn
│   └── AdminLayout.tsx    ← Sidebar admin + guard isAdmin
├── Components/
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── button.tsx
│   ├── input.tsx
│   ├── modal.tsx
│   ├── carCard.tsx        
│   └── artistCard.tsx     
├── Pages/
│   ├── Home.tsx           ← Hero + carrousel + archives
│   ├── Artistes.tsx       ← Liste artistes avec scroll-spy
│   ├── Oeuvres.tsx        ← Détail œuvre + achat + commentaires
│   ├── Edito.tsx          ← Espace perso + news + questions
│   ├── Galerie.tsx        ← Visite 3D Three.js
│   ├── AuthPage.tsx       ← Login + Register
│   ├── Profile.tsx        ← Profil utilisateur
│   └── admin/
│       ├── AdminLogin.tsx
│       ├── Dashboard.tsx
│       └── Moderation.tsx
└── assets/
    ├── wart.svg
    ├── bg-expo.webp
    ├── bg-artiste.png
    └── bg-form.jpg
```

---

## Variables d'environnement

```bash
# .env
VITE_API_URL=http://localhost:8000   # URL du backend FastAPI
```

---

## INSTALLATION

npm install

npm run dev