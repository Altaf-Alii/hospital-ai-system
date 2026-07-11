import { useState, useEffect } from 'react'
import axios from 'axios'

function Patients() {
  const [patients, setPatients] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editPatient, setEditPatient] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', age: '', gender: 'Male', phone: '',
    email: '', blood_group: '', department: '',
    doctor_name: '', status: 'Outpatient', symptoms: ''
  })

  useEffect(() => { fetchPatients() }, [])

  const fetchPatients = async () => {
    try {
      const res = await axios.get('http://localhost:8000/patients/')
      setPatients(res.data)
    } catch (err) { console.log(err) }
  }

  const handleEdit = (patient) => {
    setEditPatient(patient)
    setForm({
      name: patient.name || '',
      age: patient.age || '',
      gender: patient.gender || 'Male',
      phone: patient.phone || '',
      email: patient.email || '',
      blood_group: patient.blood_group || '',
      department: patient.department || '',
      doctor_name: patient.doctor_name || '',
      status: patient.status || 'Outpatient',
      symptoms: patient.symptoms || ''
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editPatient) {
        await axios.put(`http://localhost:8000/patients/${editPatient.id}`, {
          ...form, age: parseInt(form.age)
        })
      } else {
        await axios.post('http://localhost:8000/patients/', {
          ...form, age: parseInt(form.age)
        })
      }
      setShowForm(false)
      setEditPatient(null)
      setForm({ name: '', age: '', gender: 'Male', phone: '', email: '', blood_group: '', department: '', doctor_name: '', status: 'Outpatient', symptoms: '' })
      fetchPatients()
    } catch (err) { console.log(err) }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this patient?')) {
      await axios.delete(`http://localhost:8000/patients/${id}`)
      fetchPatients()
    }
  }

  const statusColors = {
    'Admitted': 'bg-[#58a6ff20] text-[#58a6ff]',
    'Discharged': 'bg-[#3fb95020] text-[#3fb950]',
    'Critical': 'bg-[#f8514920] text-[#f85149]',
    'Stable': 'bg-[#d2a02020] text-[#d2a020]',
    'Outpatient': 'bg-[#bc8cff20] text-[#bc8cff]',
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Patients</h1>
          <p className="text-[#8b949e] text-sm mt-1">{patients.length} total patients</p>
        </div>
        <button onClick={() => { setEditPatient(null); setForm({ name: '', age: '', gender: 'Male', phone: '', email: '', blood_group: '', department: '', doctor_name: '', status: 'Outpatient', symptoms: '' }); setShowForm(true) }}
          className="px-4 py-2 bg-[#1f6feb] text-white rounded-lg text-sm font-medium hover:bg-[#388bfd]">
          + Add Patient
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-white font-medium mb-4">{editPatient ? 'Edit Patient' : 'Add New Patient'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Full Name', key: 'name', type: 'text', required: true },
                  { label: 'Age', key: 'age', type: 'number' },
                  { label: 'Phone', key: 'phone', type: 'text' },
                  { label: 'Email', key: 'email', type: 'email' },
                  { label: 'Blood Group', key: 'blood_group', type: 'text' },
                  { label: 'Department', key: 'department', type: 'text' },
                  { label: 'Doctor Name', key: 'doctor_name', type: 'text' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs text-[#8b949e] mb-1">{field.label}</label>
                    <input type={field.type} value={form[field.key]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      required={field.required}
                      className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none focus:border-[#58a6ff]" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs text-[#8b949e] mb-1">Gender</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none">
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#8b949e] mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none">
                    <option>Outpatient</option><option>Admitted</option>
                    <option>Discharged</option><option>Critical</option><option>Stable</option>
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-xs text-[#8b949e] mb-1">Symptoms</label>
                <textarea value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                  rows={2} className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none resize-none" />
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" disabled={loading}
                  className="flex-1 py-2 bg-[#1f6feb] text-white rounded-lg text-sm font-medium disabled:opacity-50">
                  {loading ? 'Saving...' : editPatient ? 'Update Patient' : 'Save Patient'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditPatient(null) }}
                  className="flex-1 py-2 bg-[#21262d] text-[#8b949e] rounded-lg text-sm border border-[#30363d]">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#30363d]">
              {['Patient', 'Age', 'Department', 'Doctor', 'Blood', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs text-[#58a6ff] font-medium uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[#8b949e]">No patients found</td></tr>
            ) : (
              patients.map((p) => (
                <tr key={p.id} className="border-b border-[#21262d] hover:bg-[#21262d] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] flex items-center justify-center text-xs font-bold text-white">
                        {p.name?.charAt(0)}
                      </div>
                      <span className="text-white text-sm">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#8b949e] text-sm">{p.age}</td>
                  <td className="px-4 py-3 text-[#8b949e] text-sm">{p.department}</td>
                  <td className="px-4 py-3 text-[#8b949e] text-sm">{p.doctor_name}</td>
                  <td className="px-4 py-3">
                    <span className="bg-[#f8514920] text-[#f85149] text-xs px-2 py-1 rounded-full">{p.blood_group}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[p.status] || 'bg-[#8b949e20] text-[#8b949e]'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-3">
                    <button onClick={() => handleEdit(p)} className="text-xs text-[#58a6ff] hover:underline">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-xs text-[#f85149] hover:underline">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Patients