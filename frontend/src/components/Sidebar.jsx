import { useNavigate, useLocation } from 'react-router-dom'

function Sidebar({ user, setIsLoggedIn }) {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { path: '/', icon: '📊', label: 'Dashboard' },
    { path: '/patients', icon: '👥', label: 'Patients' },
    { path: '/doctors', icon: '👨‍⚕️', label: 'Doctors' },
    { path: '/appointments', icon: '📅', label: 'Appointments' },
    { path: '/ai-prediction', icon: '🤖', label: 'AI Diagnosis' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
  }

  return (
    <div className="w-56 bg-[#161b22] border-r border-[#30363d] flex flex-col h-screen">
      {/* Logo */}
      <div className="p-4 border-b border-[#30363d]">
        <h2 className="text-white font-semibold text-sm">🏥 MediCare AI</h2>
        <p className="text-[#58a6ff] text-xs mt-1">Hospital Management</p>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-2 mt-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm transition-all ${
              location.pathname === item.path
                ? 'bg-[#58a6ff20] text-[#58a6ff] border border-[#58a6ff30]'
                : 'text-[#8b949e] hover:bg-[#21262d] hover:text-[#c9d1d9]'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-3 border-t border-[#30363d]">
        <div className="flex items-center gap-2 p-2 bg-[#21262d] rounded-lg mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] flex items-center justify-center text-xs font-bold text-white">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="text-xs text-white font-medium">{user?.name || 'Admin'}</p>
            <p className="text-xs text-[#8b949e]">{user?.role || 'Administrator'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-2 text-xs text-[#f85149] hover:bg-[#da363320] rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default Sidebar