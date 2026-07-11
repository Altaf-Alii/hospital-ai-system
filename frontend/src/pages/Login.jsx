import { useState } from 'react'
import axios from 'axios'

function Login({ setIsLoggedIn, setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await axios.post('http://localhost:8000/auth/login', {
        email,
        password
      })
      setUser(res.data.user)
      setIsLoggedIn(true)
      localStorage.setItem('token', res.data.access_token)
    } catch (err) {
      setError('Invalid email or password!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🏥</div>
          <h1 className="text-2xl font-semibold text-white">Hospital AI System</h1>
          <p className="text-[#8b949e] mt-2">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8">
          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm text-[#8b949e] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hospital.com"
                className="w-full px-4 py-3 bg-[#21262d] border border-[#30363d] rounded-lg text-white placeholder-[#484f58] focus:outline-none focus:border-[#58a6ff]"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm text-[#8b949e] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-[#21262d] border border-[#30363d] rounded-lg text-white placeholder-[#484f58] focus:outline-none focus:border-[#58a6ff]"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-[#da363320] border border-[#da363340] rounded-lg text-[#f85149] text-sm">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1f6feb] hover:bg-[#388bfd] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-[#8b949e] text-sm mt-6">
          Hospital AI System v1.0.0
        </p>
      </div>
    </div>
  )
}

export default Login