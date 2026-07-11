import { useState, useEffect } from 'react'
import axios from 'axios'

function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editAppointment, setEditAppointment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    patient_name: '', doctor_name: '', department: '',
    appointment_date: '', appointment_time: '',
    status: 'Pending', notes: ''
  })

  useEffect(() => { fetchAppointments() }, [])

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://https://hospital-ai-system-production.up.railway.app/appointments/')
      setAppointments(res.data)
    } catch (err) { console.log(err) }
  }

  const handleEdit = (appointment) => {
    setEditAppointment(appointment)
    setForm({
      patient_name: appointment.patient_name || '',
      doctor_name: appointment.doctor_name || '',
      department: appointment.department || '',
      appointment_date: appointment.appointment_date || '',
      appointment_time: appointment.appointment_time || '',
      status: appointment.status || 'Pending',
      notes: appointment.notes || ''
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editAppointment) {
        await axios.put(`http://https://hospital-ai-system-production.up.railway.app/appointments/${editAppointment.id}`, form)
      } else {
        await axios.post('http://https://hospital-ai-system-production.up.railway.app/appointments/', form)
      }
      setShowForm(false)
      setEditAppointment(null)
      setForm({ patient_name: '', doctor_name: '', department: '', appointment_date: '', appointment_time: '', status: 'Pending', notes: '' })
      fetchAppointments()
    } catch (err) { console.log(err) }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this appointment?')) {
      await axios.delete(`http://https://hospital-ai-system-production.up.railway.app/appointments/${id}`)
      fetchAppointments()
    }
  }

  const updateStatus = async (id, status) => {
    await axios.put(`http://https://hospital-ai-system-production.up.railway.app/appointments/${id}`, { status })
    fetchAppointments()
  }

  const statusColors = {
    'Confirmed': 'bg-[#3fb95020] text-[#3fb950]',
    'Pending': 'bg-[#d2a02020] text-[#d2a020]',
    'Cancelled': 'bg-[#f8514920] text-[#f85149]',
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Appointments</h1>
          <p className="text-[#8b949e] text-sm mt-1">{appointments.length} total appointments</p>
        </div>
        <button onClick={() => { setEditAppointment(null); setForm({ patient_name: '', doctor_name: '', department: '', appointment_date: '', appointment_time: '', status: 'Pending', notes: '' }); setShowForm(true) }}
          className="px-4 py-2 bg-[#6e40c9] text-white rounded-lg text-sm font-medium hover:bg-[#8957e5]">
          + Book Appointment
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-white font-medium mb-4">{editAppointment ? 'Edit Appointment' : 'Book Appointment'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Patient Name', key: 'patient_name', required: true },
                  { label: 'Doctor Name', key: 'doctor_name', required: true },
                  { label: 'Department', key: 'department' },
                  { label: 'Time', key: 'appointment_time' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs text-[#8b949e] mb-1">{field.label}</label>
                    <input type="text" value={form[field.key]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      required={field.required}
                      className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none focus:border-[#58a6ff]" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs text-[#8b949e] mb-1">Date</label>
                  <input type="date" value={form.appointment_date}
                    onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
                    required className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-[#8b949e] mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none">
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-xs text-[#8b949e] mb-1">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2} className="w-full px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-white text-sm focus:outline-none resize-none" />
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" disabled={loading}
                  className="flex-1 py-2 bg-[#6e40c9] text-white rounded-lg text-sm font-medium disabled:opacity-50">
                  {loading ? 'Saving...' : editAppointment ? 'Update Appointment' : 'Book Appointment'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditAppointment(null) }}
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
              {['Patient', 'Doctor', 'Department', 'Date & Time', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs text-[#58a6ff] font-medium uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[#8b949e]">No appointments found</td></tr>
            ) : (
              appointments.map((a) => (
                <tr key={a.id} className="border-b border-[#21262d] hover:bg-[#21262d] transition-colors">
                  <td className="px-4 py-3 text-white text-sm">{a.patient_name}</td>
                  <td className="px-4 py-3 text-[#8b949e] text-sm">{a.doctor_name}</td>
                  <td className="px-4 py-3 text-[#58a6ff] text-sm">{a.department}</td>
                  <td className="px-4 py-3 text-[#8b949e] text-sm">
                    {a.appointment_date} {a.appointment_time && `• ${a.appointment_time}`}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[a.status] || 'bg-[#8b949e20] text-[#8b949e]'}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-3">
                    <button onClick={() => handleEdit(a)} className="text-xs text-[#58a6ff] hover:underline">Edit</button>
                    <button onClick={() => handleDelete(a.id)} className="text-xs text-[#f85149] hover:underline">Delete</button>
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

export default Appointments