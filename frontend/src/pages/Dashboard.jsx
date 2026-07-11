import { useState, useEffect } from 'react'
import axios from 'axios'

function Dashboard() {
  const [stats, setStats] = useState({
    total_patients: 0,
    total_doctors: 0,
    total_appointments: 0,
    admitted_patients: 0
  })

  useEffect(() => {
    axios.get('http://https://hospital-ai-system-production.up.railway.app/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(err => console.log(err))
  }, [])

  const statCards = [
    { label: 'Total Patients', value: stats.total_patients, icon: '👥', color: 'text-[#58a6ff]', bg: 'bg-[#58a6ff15]' },
    { label: 'Total Doctors', value: stats.total_doctors, icon: '👨‍⚕️', color: 'text-[#3fb950]', bg: 'bg-[#3fb95015]' },
    { label: 'Appointments', value: stats.total_appointments, icon: '📅', color: 'text-[#bc8cff]', bg: 'bg-[#bc8cff15]' },
    { label: 'Admitted', value: stats.admitted_patients, icon: '🛏️', color: 'text-[#f85149]', bg: 'bg-[#f8514915]' },
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        <p className="text-[#8b949e] text-sm mt-1">Welcome to Hospital AI System</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center text-xl mb-3`}>
              {card.icon}
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-[#8b949e] text-xs mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
        <h3 className="text-white font-medium mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Add Patient', icon: '➕', color: 'bg-[#1f6feb]' },
            { label: 'Add Doctor', icon: '👨‍⚕️', color: 'bg-[#238636]' },
            { label: 'Book Appointment', icon: '📅', color: 'bg-[#6e40c9]' },
          ].map((action, i) => (
            <button
              key={i}
              className={`${action.color} text-white py-3 px-4 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity`}
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard