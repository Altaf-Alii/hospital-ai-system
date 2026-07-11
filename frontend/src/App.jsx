import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import Doctors from './pages/Doctors'
import Appointments from './pages/Appointments'
import AIPrediction from './pages/AIPrediction'
import Login from './pages/Login'
import Sidebar from './components/Sidebar'
import { useState } from 'react'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  if (!isLoggedIn) {
    return <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
  }

  return (
    <Router>
      <div className="flex h-screen bg-[#0d1117]">
        <Sidebar user={user} setIsLoggedIn={setIsLoggedIn} />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/ai-prediction" element={<AIPrediction />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App