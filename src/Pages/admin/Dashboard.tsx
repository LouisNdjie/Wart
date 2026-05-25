// pages/admin/Dashboard.tsx
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'
import { getStats } from '../../api/client'
import type { DashboardStats } from '../../types'

// Les données de tendance restent en dur pour la maquette visuelle du graphique
const VISITS_MOCK = [
  { mois: 'Jan', visites: 820 },
  { mois: 'Fév', visites: 1140 },
  { mois: 'Mar', visites: 960 },
  { mois: 'Avr', visites: 1380 },
  { mois: 'Mai', visites: 1200 },
  { mois: 'Jun', visites: 1580 },
]

const CATEGORIES_MOCK = [
  { name: 'Peinture', value: 42, color: '#E2725B' },
  { name: 'Sculpture', value: 26, color: '#6b7a3e' },
  { name: 'Photo', value: 18, color: '#B4B2A9' },
  { name: 'Autre', value: 14, color: '#FAECE7' },
]

export default function Dashboard() {
  // SOLUTION : On remplace <any> par notre nouveau type ou null
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStats()
      .then(res => setStats(res as DashboardStats)) // Cast propre de la réponse API
      .catch(err => console.error('Erreur stats:', err))
      .finally(() => setLoading(false))
  }, [])

  // Fallbacks si l'API n'a pas encore répondu
  const metrics = [
    { label: 'Œuvres totales', value: stats?.oeuvres_count || 284, delta: '+12 ce mois', color: 'text-green-700 bg-green-50' },
    { label: 'Artistes', value: stats?.artistes_count || 42, delta: '+3 nouveaux', color: 'text-green-700 bg-green-50' },
    { label: 'Collectionneurs', value: stats?.collectionneurs_count || 318, delta: '+27 ce mois', color: 'text-green-700 bg-green-50' },
    { label: "Demandes d'achat", value: stats?.demandes_count || 18, delta: '7 en attente', color: 'text-amber-700 bg-amber-50' },
  ]

  const demandes = stats?.demandes_recentes || [
    { id: 1, name: 'Marie L.', oeuvre: 'Pancha-mama', prix: 4800, date: 'Hier', status: 'pending' },
    { id: 2, name: 'Thomas R.', oeuvre: 'Formes Vivantes', prix: 2200, date: 'Il y a 2j', status: 'approved' },
    { id: 3, name: 'Aïcha D.', oeuvre: 'Strates', prix: 1600, date: 'Il y a 3j', status: 'rejected' },
  ]

  const statusMap: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 labels',
    approved: 'bg-green-50 text-green-700 labels',
    rejected: 'bg-red-50 text-red-700 labels',
  }

  if (loading) {
    return <div className="p-8 text-xs font-mono text-gray-400">Chargement des données...</div>
  }

  return (
    <div className="p-6 flex flex-col gap-6 max-w-5xl font-sans">
      
      {/* Grille de KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((card) => (
          <div key={card.label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-xs">
            <span className="text-[11px] font-medium text-gray-400 block mb-1">{card.label}</span>
            <span className="text-2xl font-bold text-gray-900 leading-none">{card.value}</span>
            <div className="mt-2">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${card.color}`}>
                {card.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Blocs Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Visites */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">Visites mensuelles</h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={VISITS_MOCK} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #f3f4f6' }} cursor={{ fill: '#FAECE7' }} />
              <Bar dataKey="visites" radius={[4, 4, 0, 0]}>
                {VISITS_MOCK.map((_, idx) => (
                  <Cell key={idx} fill={idx === VISITS_MOCK.length - 1 ? '#E2725B' : '#f5c8bf'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition Médiums */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">Ventes par médium</h4>
          <div className="flex items-center gap-8 h-45">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={CATEGORIES_MOCK} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={2}>
                  {CATEGORIES_MOCK.map((item, idx) => (
                    <Cell key={idx} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="flex flex-col gap-2.5">
              {CATEGORIES_MOCK.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: item.color }} />
                  <span>{item.name} &bull; {item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tableau Demandes Récentes */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">Dernières demandes d'achat</h4>
          <button className="text-xs font-semibold text-[#E2725B] hover:underline">Voir tout</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="pb-2.5 font-semibold">Collectionneur</th>
                <th className="pb-2.5 font-semibold">Œuvre</th>
                <th className="pb-2.5 font-semibold">Prix</th>
                <th className="pb-2.5 font-semibold">Date</th>
                <th className="pb-2.5 font-semibold text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {demandes.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 font-medium text-gray-900">{row.name}</td>
                  <td className="py-3 text-gray-500 italic">{row.oeuvre}</td>
                  <td className="py-3 text-gray-900 font-mono">{(row.prix || 0).toLocaleString('fr-FR')} €</td>
                  <td className="py-3 text-gray-400 text-xs">{row.date}</td>
                  <td className="py-3 text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${statusMap[row.status] || 'bg-gray-50 text-gray-600'}`}>
                      {row.status === 'pending' ? 'En attente' : row.status === 'approved' ? 'Accepté' : 'Refusé'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
