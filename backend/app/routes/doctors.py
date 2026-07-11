from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models.doctor import Doctor

router = APIRouter(prefix="/doctors", tags=["Doctors"])

class DoctorCreate(BaseModel):
    name: str
    specialization: Optional[str] = None
    experience: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    department: Optional[str] = None
    availability: Optional[bool] = True
    qualification: Optional[str] = None
    bio: Optional[str] = None

class DoctorUpdate(BaseModel):
    name: Optional[str] = None
    specialization: Optional[str] = None
    experience: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    department: Optional[str] = None
    availability: Optional[bool] = None
    qualification: Optional[str] = None
    bio: Optional[str] = None

@router.get("/")
def get_doctors(db: Session = Depends(get_db)):
    return db.query(Doctor).all()

@router.get("/available/list")
def get_available_doctors(db: Session = Depends(get_db)):
    return db.query(Doctor).filter(Doctor.availability == True).all()

@router.get("/{doctor_id}")
def get_doctor(doctor_id: int, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor

@router.post("/")
def create_doctor(request: DoctorCreate, db: Session = Depends(get_db)):
    doctor = Doctor(**request.dict())
    db.add(doctor)
    db.commit()
    db.refresh(doctor)
    return {"message": "Doctor added successfully", "doctor_id": doctor.id}

@router.put("/{doctor_id}")
def update_doctor(doctor_id: int, request: DoctorUpdate, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    update_data = request.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(doctor, key, value)
    
    db.commit()
    db.refresh(doctor)
    return {"message": "Doctor updated successfully"}

@router.delete("/{doctor_id}")
def delete_doctor(doctor_id: int, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    db.delete(doctor)
    db.commit()
    return {"message": "Doctor deleted successfully"}