from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import date
from app.database import get_db
from app.models.patient import Patient

router = APIRouter(prefix="/patients", tags=["Patients"])

class PatientCreate(BaseModel):
    name: str
    age: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    blood_group: Optional[str] = None
    department: Optional[str] = None
    doctor_name: Optional[str] = None
    status: Optional[str] = "Outpatient"
    symptoms: Optional[str] = None
    diagnosis: Optional[str] = None
    admission_date: Optional[date] = None

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    blood_group: Optional[str] = None
    department: Optional[str] = None
    doctor_name: Optional[str] = None
    status: Optional[str] = None
    symptoms: Optional[str] = None
    diagnosis: Optional[str] = None
    discharge_date: Optional[date] = None

@router.get("/")
def get_patients(db: Session = Depends(get_db)):
    return db.query(Patient).all()

@router.get("/search/{name}")
def search_patients(name: str, db: Session = Depends(get_db)):
    return db.query(Patient).filter(Patient.name.contains(name)).all()

@router.get("/{patient_id}")
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.post("/")
def create_patient(request: PatientCreate, db: Session = Depends(get_db)):
    patient = Patient(**request.dict())
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return {"message": "Patient added successfully", "patient_id": patient.id}

@router.put("/{patient_id}")
def update_patient(patient_id: int, request: PatientUpdate, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    update_data = request.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(patient, key, value)
    
    db.commit()
    db.refresh(patient)
    return {"message": "Patient updated successfully"}

@router.delete("/{patient_id}")
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(patient)
    db.commit()
    return {"message": "Patient deleted successfully"}