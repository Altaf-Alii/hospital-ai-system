import { useState, useEffect } from 'react'
import axios from 'axios'

function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editDoctor, setEditDoctor] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', specialization: '', experience: '',
    phone: '', email: '', department: '',
    qualification: '', bio: '', availability: true
  })

  useEffect(() => { fetchDoctors() }, [])

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://https://hospital-ai-system-production.up.railway.app/doctors/')
      setDoctors(res.data)
    } catch (err) { console.log(err) }
  }

  const handleEdit = (doctor) => {
    setEditDoctor(doctor)
    setForm({
      name: doctor.name || '',
      specialization: doctor.specialization || '',
      experience: doctor.experience || '',
      phone: doctor.phone || '',
      email: doctor.email || '',
      department: doctor.department || '',
      qualification: doctor.qualification || '',
      bio: doctor.bio || '',
      availability: doctor.availability
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editDoctor) {
        await axios.put(`http://https://hospital-ai-system-production.up.railway.app/doctors/${editDoctor.id}`, form)
      } else {
        await axios.post('http://https://hospital-ai-system-production.up.railway.app/doctors/', form)
      }
      setShowForm(false)
      setEditDoctor(null)
      setForm({ name: '', specialization: '', experience: '', phone: '', email: '', department: '', qualification: '', bio: '', availability: true })
      fetchDoctors()
    } catch (err) { console.log(err) }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this doctor?')) {
      await axios.delete(`http://https://hospital-ai-system-production.up.railway.app/doctors/${id}`)
      fetchDoctors()
    }
  }

  const toggleAvailability = async (doctor) => {
    await axios.put(`http://https://hospital-ai-system-production.up.railway.app/doctors/${doctor.id}`, { availability: !doctor.availability })
    fetchDoctors()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Doctors</h1>
          <p className="text-[#8b949e] text-sm mt-1">{doctors.length} total doctors</p>
        </div>
        <button onClick={() => { setEditDoctor(null); setForm({ name: '', specialization: '', experience: '', phone: '', email: '', department: '', qualification: '', bio: '', availability: true }); setShowForm(true) }}
          className="px-4 py-2 bg-[#238636] text-white rounded-lg text-sm font-medium hover:bg-[#2ea043]">
          + Add Doctor
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-white font-medium mb-4">{editDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Full Name', key: 'name', required: true },
                  { label: 'Specialization', key: 'specialization' },
                  { label: 'Experience', key: 'experience' },
                  { label: 'Phone', key: 'phone' },
                  { label: 'Email', key: 'email' },
                  { label: 'Department', key: 'department' },
                  { label: 'Qualification', key: 'qualification' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs text-[#8b949e] mb-1">{field.label}</label>
                    <input type="text" value={form[field.key]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      required={field.required}
                      className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none focus:border-[#58a6ff]" />
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <label className="block text-xs text-[#8b949e] mb-1">Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={2} className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none resize-none" />
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" disabled={loading}
                  className="flex-1 py-2 bg-[#238636] text-white rounded-lg text-sm font-medium disabled:opacity-50">
                  {loading ? 'Saving...' : editDoctor ? 'Update Doctor' : 'Save Doctor'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditDoctor(null) }}
                  className="flex-1 py-2 bg-[#21262d] text-[#8b949e] rounded-lg text-sm border border-[#30363d]">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {doctors.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-[#8b949e]">No doctors found</div>
        ) : (
          doctors.map((d) => (
            <div key={d.id} className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3fb950] to-[#58a6ff] flex items-center justify-center text-lg font-bold text-white">
                  {d.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{d.name}</p>
                  <p className="text-[#8b949e] text-xs">{d.specialization}</p>
                </div>
              </div>
              <div className="space-y-1 mb-4">
                <p className="text-[#8b949e] text-xs">🏥 {d.department}</p>
                <p className="text-[#8b949e] text-xs">🎓 {d.qualification}</p>
                <p className="text-[#8b949e] text-xs">⏱️ {d.experience}</p>
              </div>
              <div className="flex items-center justify-between">
                <button onClick={() => toggleAvailability(d)}
                  className={`text-xs px-3 py-1 rounded-full ${d.availability ? 'bg-[#3fb95020] text-[#3fb950]' : 'bg-[#f8514920] text-[#f85149]'}`}>
                  {d.availability ? 'Available' : 'Busy'}
                </button>
                <div className="flex gap-3">
                  <button onClick={() => handleEdit(d)} className="text-xs text-[#58a6ff] hover:underline">Edit</button>
                  <button onClick={() => handleDelete(d.id)} className="text-xs text-[#f85149] hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Doctors