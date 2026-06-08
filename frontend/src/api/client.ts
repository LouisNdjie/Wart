
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000' // Le port sur lequel le backend sera branché

// Mon utilitaire générique pour les requêtes avec gestion d'erreur centralisée
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('wart_token')

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Erreur réseau' }))
    throw new Error(err.detail ?? `Erreur ${res.status}`)
  }

  return res.json()
}

// GESTION DE L'AUTHENTIFICATION

export async function login(email: string, password: string) {
  
  const data = await request<{ access_token: string; user: { id: string; username: string; role: string; email: string } }>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }
  )
  localStorage.setItem('wart_token', data.access_token)
  return data.user
}

export async function register(username: string, email: string, password: string, role: string) {
  
  const data = await request<{ access_token: string; user: { id: string; username: string; role: string } }>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify({ username, email, password, role }),
    }
  )
  localStorage.setItem('wart_token', data.access_token)
  return data.user
}

export function logout() {
  localStorage.removeItem('wart_token')
}

export async function adminLogin(username: string, password: string) {
  
  const data = await request<{ access_token: string }>('/auth/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  localStorage.setItem('wart_admin_token', data.access_token)
  return data
}

export async function getMe() {
  
  return request('/auth/me')
}



// GESTION DES ARTISTES
export async function getArtistes() {
  
  return request('/artistes')
}

export async function getArtiste(id: number) {
  
  return request(`/artistes/${id}`)
}

export async function createArtiste(data: FormData) {
  
  const token = localStorage.getItem('wart_token')
  const res = await fetch(`${BASE_URL}/artistes`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: data,  // multipart pour l'avatar
  })
  if (!res.ok) throw new Error('Erreur création artiste')
  return res.json()
}

// GEsSTION DES OEUVRES(par genre artiste)

export async function getOeuvres(params?: { tag?: string; statut?: string }) {
  
  const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''
  return request(`/oeuvres${qs}`)
}

export async function getOeuvre(id: number) {
  
  return request(`/oeuvres/${id}`)
}

export async function createOeuvre(data: FormData) {
  
  const token = localStorage.getItem('wart_token')
  const res = await fetch(`${BASE_URL}/oeuvres`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: data,  // multipart pour l'image
  })
  if (!res.ok) throw new Error('Erreur création œuvre')
  return res.json()
}

export async function updateOeuvre(id: number, data: Partial<{ statut: string; prix: number }>) {
  
  return request(`/oeuvres/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
}

export async function deleteOeuvre(id: number) {
  
  return request(`/oeuvres/${id}`, { method: 'DELETE' })
}




//GESTION DES LIKES ET COMMENTAIRES
export async function likeOeuvre(id: number) {
  
  return request(`/oeuvres/${id}/like`, { method: 'POST' })
}

export async function getCommentaires(oeuvreId: number) {
  
  return request(`/oeuvres/${oeuvreId}/commentaires`)
}

export async function postCommentaire(oeuvreId: number, message: string) {
  
  return request(`/oeuvres/${oeuvreId}/commentaires`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  })
}




// DEMANDES D'ACHAT

export async function demanderAchat(oeuvreId: number, data: { nom: string; email: string; message?: string }) {

  return request(`/oeuvres/${oeuvreId}/demandes`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getDemandes(params?: { statut?: string }) {

  const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''
  return request(`/admin/demandes${qs}`)
}

export async function updateDemande(id: number, statut: string) {
  
  return request(`/admin/demandes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ statut }),
  })
}

// GESTION DES  EXPOSITIONS 

export async function getExpositions(statut?: 'en_cours' | 'archive') {
  
  const qs = statut ? `?statut=${statut}` : ''
  return request(`/expositions${qs}`)
}

// GESTION DE  L'ÉDITO / ARTICLES 

export async function getArticles(rubrique?: string) {
  
  const qs = rubrique ? `?rubrique=${encodeURIComponent(rubrique)}` : ''
  return request(`/articles${qs}`)
}

export async function getArticle(id: number) {
  
  return request(`/articles/${id}`)
}

export async function createArticle(data: object) {
  
  return request('/articles', { method: 'POST', body: JSON.stringify(data) })
}




// PRISE EN CHARGE DES QUESTIONS

export async function getQuestions() {
  
  return request('/questions')
}

export async function postQuestion(question: string) {
  
  return request('/questions', { method: 'POST', body: JSON.stringify({ question }) })
}

// NOTIFICATIONS

export async function getNotifications() {
  
  return request('/notifications/me')
}

export async function markNotifRead(id: number) {
  
  return request(`/notifications/${id}/read`, { method: 'PATCH' })
}

export async function markAllNotifsRead() {
  
  return request('/notifications/read-all', { method: 'PATCH' })
}

// COLLECTION (espace personnel collectioneur / artiste) 

export async function getMyCollection() {
  // 
  return request('/me/collection')
}

// ADMIN

export async function getStats() {
  
  return request('/admin/stats')
}

export async function getVisites() {
  
  return request('/admin/stats/visites')
}

export async function getCommentairesSignales() {
  
  return request('/admin/commentaires/signales')
}

export async function supprimerCommentaire(id: number) {
  
  return request(`/admin/commentaires/${id}`, { method: 'DELETE' })
}

export async function bannirUser(userId: string) {
  
  return request(`/admin/users/${userId}/ban`, { method: 'POST' })
}

export async function getUsers(role?: string) {
  
  const qs = role ? `?role=${role}` : ''
  return request(`/admin/users${qs}`)
}
