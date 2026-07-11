from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from app.database import get_db
from app.models.patient import Patient
from app.ai.predictor import ALL_SYMPTOMS, normalize_symptom_text, predict_from_symptoms

router = APIRouter(prefix="/ai", tags=["AI Prediction"])


class PredictRequest(BaseModel):
    symptoms: List[str]


class ApplyDiagnosisRequest(BaseModel):
    save_to_diagnosis: Optional[bool] = False


@router.get("/symptoms")
def get_symptom_list():
    """Full list of symptom keys the AI model understands (for building a checklist in the UI)."""
    return {"symptoms": ALL_SYMPTOMS}


@router.post("/predict")
def predict_disease(request: PredictRequest):
    """Predict probable disease from a list of symptom keys (from /ai/symptoms)."""
    valid = [s for s in request.symptoms if s in ALL_SYMPTOMS]
    invalid = [s for s in request.symptoms if s not in ALL_SYMPTOMS]

    if not valid:
        raise HTTPException(status_code=400, detail="None of the provided symptoms are recognized.")

    results = predict_from_symptoms(valid)
    if not results:
        raise HTTPException(status_code=404, detail="Could not confidently predict a disease.")

    return {
        "top_prediction": results[0],
        "other_possibilities": results[1:],
        "unrecognized_symptoms": invalid,
    }


@router.post("/predict/patient/{patient_id}")
def predict_for_patient(
    patient_id: int,
    request: ApplyDiagnosisRequest = ApplyDiagnosisRequest(),
    db: Session = Depends(get_db),
):
    """
    Predicts disease directly from an existing patient's stored `symptoms` field
    (free text, e.g. "high fever, cough, body ache").
    If save_to_diagnosis=true, writes the top suggestion into Patient.diagnosis.
    """
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    if not patient.symptoms:
        raise HTTPException(status_code=400, detail="This patient has no symptoms recorded yet.")

    recognized, unrecognized = normalize_symptom_text(patient.symptoms)
    if not recognized:
        raise HTTPException(
            status_code=400,
            detail=f"Could not match any recorded symptoms to known symptom list: {patient.symptoms}",
        )

    results = predict_from_symptoms(recognized)
    if not results:
        raise HTTPException(status_code=404, detail="Could not confidently predict a disease.")

    if request.save_to_diagnosis:
        patient.diagnosis = f"AI Suggested: {results[0]['disease']} ({results[0]['confidence']}% confidence)"
        db.commit()
        db.refresh(patient)

    return {
        "patient_id": patient.id,
        "patient_name": patient.name,
        "matched_symptoms": recognized,
        "unrecognized_symptoms": unrecognized,
        "top_prediction": results[0],
        "other_possibilities": results[1:],
        "saved_to_diagnosis": bool(request.save_to_diagnosis),
    }
