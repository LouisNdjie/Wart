
// Enums et Types de configuration globale
export type UserRole = 'artiste' | 'collectionneur' | 'admin'
export type OeuvreStatut = 'Disponible' | 'Réservé' | 'Vendu'
export type DemandeStatut = 'en_attente' | 'acceptee' | 'refusee'
export type NotifType = 'info' | 'achat' | 'question' | 'news'
export type AuthMode = 'login' | 'register'

/* ==========================================
   ENTITÉS PRINCIPALES
   ========================================== */

export type User = {
  id: string
  username: string
  email: string
  role: UserRole
  avatar?: string
}

export type Artiste = {
  id: number
  tag: string
  artistName: string
  artistHandle: string
  artistAvatar?: string
  artistProfile: string
  artistPaints: string[] // URLs des visuels
}

export type Oeuvre = {
  id: number
  titre: string
  artiste: string
  artisteId: number
  artisteHandle: string
  annee: string | number // En cas de conflit de type
  dimensions: string
  medium: string
  statut: OeuvreStatut
  prix: number
  likes: number
  description: string
  imageUrl?: string
  imageColor?: string // Fallback de couleur pour les maquettes
  tag: string
  collection?: string
}

/* ==========================================
   INTERACTIONS & CONTENU
   ========================================== */

export type Commentaire = {
  id: number
  auteur: string
  date: string
  message: string
  oeuvreId: number
}

export type Exposition = {
  id: number
  title: string
  description: string
  dates: string
  tag: string
  imageUrl: string
  artistName: string
  artistHandle: string
  artistAvatar?: string
  views: number
  comments: number
  likes: number
  statut: 'en_cours' | 'archive'
}

export type Article = {
  id: number
  rubrique: 'Dans l\'Atelier' | 'Le Manifeste' | 'Zoom sur...' | 'La Minute Curieuse' | 'Questions'
  titre: string
  excerpt: string
  author: string
  date: string
  readTime: number
  imageColor: string
  featured?: boolean
  answersCount?: number
}

/* ==========================================
   SYSTÈME & SUIVI 
   ========================================== */

export type Notification = {
  id: number
  type: NotifType
  message: string
  date: string
  read: boolean
  userId: string
}

export type DemandeAchat = {
  id: number
  collectionneurId: string
  collectionneurNom: string
  oeuvreId: number
  oeuvreTitle: string
  prix: number
  date: string
  statut: DemandeStatut
  message?: string
}

export type OeuvreCollection = {
  id: number
  title: string
  artiste: string
  prix: number
  statut: 'acquise' | 'en_cours'
  imageColor: string
  date: string
}

export type DashboardStats = {
  oeuvres_count: number
  artistes_count: number
  collectionneurs_count: number
  demandes_count: number
  demandes_recentes: Array<{
    id: number
    name: string
    oeuvre: string
    prix: number
    date: string
    status: 'pending' | 'approved' | 'rejected'
  }>
}
