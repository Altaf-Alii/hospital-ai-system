"""
Loads the trained disease-prediction model once at import time and
exposes a simple predict_from_symptoms() function used by the
/ai routes.
"""

import pickle
import re
from pathlib import Path

import numpy as np

MODEL_DIR = Path(__file__).parent

with open(MODEL_DIR / "model.pkl", "rb") as f:
    _model = pickle.load(f)
with open(MODEL_DIR / "symptom_list.pkl", "rb") as f:
    _mlb = pickle.load(f)
with open(MODEL_DIR / "label_encoder.pkl", "rb") as f:
    _le = pickle.load(f)

ALL_SYMPTOMS = list(_mlb.classes_)


def normalize_symptom_text(raw_text: str):
    """
    Converts a free-text symptoms string (as stored on Patient.symptoms,
    e.g. "high fever, cough, body ache") into a list of known symptom
    keys the model understands (e.g. ["high_fever", "cough", "body_ache"]).

    Unrecognized fragments are ignored (returned separately).
    """
    if not raw_text:
        return [], []

    # split on commas / semicolons / newlines
    fragments = re.split(r"[,;\n]", raw_text.lower())
    recognized, unrecognized = [], []

    for frag in fragments:
        key = frag.strip().replace(" ", "_").replace("-", "_")
        if not key:
            continue
        if key in ALL_SYMPTOMS:
            recognized.append(key)
        else:
            # try loose contains-match (handles minor wording differences)
            match = next((s for s in ALL_SYMPTOMS if key in s or s in key), None)
            if match:
                recognized.append(match)
            else:
                unrecognized.append(frag.strip())

    return list(dict.fromkeys(recognized)), unrecognized  # dedupe, preserve order


def predict_from_symptoms(symptoms: list[str], top_n: int = 4):
    """
    symptoms: list of symptom keys already validated against ALL_SYMPTOMS.
    Returns list of {disease, confidence} dicts sorted by confidence desc.
    """
    vector = _mlb.transform([symptoms])
    probs = _model.predict_proba(vector)[0]

    top_idx = np.argsort(probs)[::-1][:top_n]
    diseases = _le.inverse_transform(top_idx)

    results = [
        {"disease": str(d), "confidence": round(float(probs[i]) * 100, 1)}
        for d, i in zip(diseases, top_idx)
        if probs[i] > 0.01
    ]
    return results
