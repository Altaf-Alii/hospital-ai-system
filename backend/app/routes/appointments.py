from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import date
from app.database import get_db
from app.models.appointment import Appointment

router = APIRouter(prefix="/appointments", tags=["Appointments"])

class AppointmentCreate(BaseModel):
    patient_name: str
    patient_id: Optional[int] = None
    doctor_name: str
    doctor_id: Optional[int] = None
    department: Optional[str] = None
    appointment_date: date
    appointment_time: Optional[str] = None
    status: Optional[str] = "Pending"
    notes: Optional[str] = None

class AppointmentUpdate(BaseModel):
    patient_name: Optional[str] = None
    doctor_name: Optional[str] = None
    department: Optional[str] = None
    status: Optional[str] = None
    appointment_date: Optional[date] = None
    appointment_time: Optional[str] = None
    notes: Optional[str] = None

@router.get("/")
def get_appointments(db: Session = Depends(get_db)):
    return db.query(Appointment).all()

@router.get("/today/list")
def get_today_appointments(db: Session = Depends(get_db)):
    today = date.today()
    return db.query(Appointment).filter(Appointment.appointment_date == today).all()

@router.get("/{appointment_id}")
def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

@router.post("/")
def create_appointment(request: AppointmentCreate, db: Session = Depends(get_db)):
    appointment = Appointment(**request.dict())
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return {"message": "Appointment booked successfully", "appointment_id": appointment.id}

@router.put("/{appointment_id}")
def update_appointment(appointment_id: int, request: AppointmentUpdate, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    update_data = request.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(appointment, key, value)
    
    db.commit()
    db.refresh(appointment)
    return {"message": "Appointment updated successfully"}

@router.delete("/{appointment_id}")
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    db.delete(appointment)
    db.commit()
    return {"message": "Appointment deleted successfully"}