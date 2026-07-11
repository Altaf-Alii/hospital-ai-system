import { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:8000'

const formatLabel = (key) =>
  key
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

function AIPrediction() {
  const [allSymptoms, setAllSymptoms] = useState([])
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchingList, setFetchingList] = useState(true)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API_BASE}/ai/symptoms`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load symptom list')
        return res.json()
      })
      .then((data) => setAllSymptoms(data.symptoms || []))
      .catch(() => setError('Could not connect to AI service. Is the backend running?'))
      .finally(() => setFetchingList(false))
  }, [])

  const toggleSymptom = (symptom) => {
    setSelected((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    )
  }

  const handlePredict = async () => {
    if (selected.length === 0) {
      setError('Please select at least one symptom.')
      return
    }
    setError('')
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`${API_BASE}/ai/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: selected }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Prediction failed')
      }
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">🤖</span>
        <h1 className="text-white font-semibold text-2xl">AI Diagnosis</h1>
      </div>
      <p className="text-[#8b949e] text-sm mb-6">
        Select symptoms to get an AI-powered probable diagnosis suggestion.
      </p>

      {error && (
        <div className="flex items-center gap-2 bg-[#da363320] border border-[#f85149] text-[#f85149] px-4 py-3 rounded-lg mb-4 text-sm">
          ⚠️ {error}
        </div>
      )}

      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 mb-5">
        <h2 className="text-xs font-semibold text-[#8b949e] mb-4 uppercase tracking-wide">
          Select Symptoms
        </h2>

        {fetchingList ? (
          <p className="text-[#8b949e] text-sm">Loading symptoms...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {allSymptoms.map((symptom) => {
              const isActive = selected.includes(symptom)
              return (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`text-left px-3 py-2 rounded-lg border text-sm transition-all ${
                    isActive
                      ? 'bg-[#58a6ff20] text-[#58a6ff] border-[#58a6ff30]'
                      : 'bg-[#21262d] border-[#30363d] text-[#8b949e] hover:text-[#c9d1d9] hover:border-[#58a6ff30]'
                  }`}
                >
                  {formatLabel(symptom)}
                </button>
              )
            })}
          </div>
        )}

        <button
          onClick={handlePredict}
          disabled={loading || fetchingList}
          className="mt-5 flex items-center gap-2 bg-[#58a6ff] hover:bg-[#4a94e8] disabled:opacity-50 disabled:cursor-not-allowed text-[#0d1117] font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          {loading ? '⏳ Analyzing...' : '🩺 Get AI Prediction'}
        </button>
      </div>

      {result && (
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
          <h2 className="text-xs font-semibold text-[#8b949e] mb-4 uppercase tracking-wide">
            Prediction Result
          </h2>

          <div className="flex items-center justify-between bg-gradient-to-r from-[#58a6ff20] to-[#bc8cff20] border border-[#58a6ff30] rounded-lg px-5 py-4 mb-4">
            <div>
              <div className="text-xs text-[#8b949e] mb-1">Most Likely</div>
              <div className="text-xl font-bold text-white">{result.top_prediction.disease}</div>
            </div>
            <div className="text-2xl font-bold text-[#58a6ff]">
              {result.top_prediction.confidence}%
            </div>
          </div>

          {result.other_possibilities?.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-[#8b949e] mb-2">Other Possibilities</div>
              {result.other_possibilities.map((p) => (
                <div
                  key={p.disease}
                  className="flex items-center justify-between bg-[#21262d] rounded-lg px-4 py-2.5"
                >
                  <span className="text-[#c9d1d9] text-sm">{p.disease}</span>
                  <span className="text-[#8b949e] text-sm">{p.confidence}%</span>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-[#8b949e] mt-4">
            ⚠️ This is an AI-generated suggestion, not a medical diagnosis. Please consult a
            qualified doctor.
          </p>
        </div>
      )}
    </div>
  )
}

export default AIPrediction