import React, { useState, useEffect } from "react";
import { Brain, Loader2, AlertCircle, Stethoscope } from "lucide-react";

/**
 * AI Disease Prediction page.
 * Matches the dark dashboard theme (slate background, blue/green/purple accents).
 *
 * USAGE:
 * 1. Copy into src/pages/AIPrediction.jsx (or wherever your other pages live)
 * 2. Add a sidebar link + route, e.g.:
 *      <Route path="/ai-prediction" element={<AIPrediction />} />
 * 3. Update API_BASE below to match your backend URL.
 */

const API_BASE = "http://https://hospital-ai-system-production.up.railway.app"; // <-- change if your backend runs on a different host/port

// Friendly display labels for symptom keys (snake_case -> readable)
const formatLabel = (key) =>
  key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export default function AIPrediction() {
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingList, setFetchingList] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/ai/symptoms`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load symptom list");
        return res.json();
      })
      .then((data) => setAllSymptoms(data.symptoms || []))
      .catch(() => setError("Could not connect to AI service. Is the backend running?"))
      .finally(() => setFetchingList(false));
  }, []);

  const toggleSymptom = (symptom) => {
    setSelected((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handlePredict = async () => {
    if (selected.length === 0) {
      setError("Please select at least one symptom.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/ai/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: selected }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Prediction failed");
      }
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-1">
          <Brain className="text-purple-400" size={28} />
          <h1 className="text-2xl font-bold">AI Disease Prediction</h1>
        </div>
        <p className="text-slate-400 mb-8">
          Select symptoms to get an AI-powered probable diagnosis suggestion.
        </p>

        {error && (
          <div className="flex items-center gap-2 bg-red-950/40 border border-red-800 text-red-300 px-4 py-3 rounded-lg mb-6">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">
            Select Symptoms
          </h2>

          {fetchingList ? (
            <div className="flex items-center gap-2 text-slate-400">
              <Loader2 className="animate-spin" size={18} />
              Loading symptoms...
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {allSymptoms.map((symptom) => {
                const isActive = selected.includes(symptom);
                return (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                      isActive
                        ? "bg-blue-600/20 border-blue-500 text-blue-300"
                        : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {formatLabel(symptom)}
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={handlePredict}
            disabled={loading || fetchingList}
            className="mt-6 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Stethoscope size={18} />}
            {loading ? "Analyzing..." : "Get AI Prediction"}
          </button>
        </div>

        {result && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">
              Prediction Result
            </h2>

            <div className="flex items-center justify-between bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-lg px-5 py-4 mb-4">
              <div>
                <div className="text-xs text-slate-400 mb-1">Most Likely</div>
                <div className="text-xl font-bold text-white">{result.top_prediction.disease}</div>
              </div>
              <div className="text-2xl font-bold text-purple-300">
                {result.top_prediction.confidence}%
              </div>
            </div>

            {result.other_possibilities.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs text-slate-400 mb-2">Other Possibilities</div>
                {result.other_possibilities.map((p) => (
                  <div
                    key={p.disease}
                    className="flex items-center justify-between bg-slate-800/50 rounded-lg px-4 py-2.5"
                  >
                    <span className="text-slate-200 text-sm">{p.disease}</span>
                    <span className="text-slate-400 text-sm">{p.confidence}%</span>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-slate-500 mt-4">
              ⚠️ This is an AI-generated suggestion, not a medical diagnosis. Please consult a
              qualified doctor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
