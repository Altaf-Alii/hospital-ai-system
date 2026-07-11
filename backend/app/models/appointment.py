from sqlalchemy import Column, Integer, String, DateTime, Text, Date, Time
from sqlalchemy.sql import func
from app.database import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String(100), nullable=False)
    patient_id = Column(Integer)
    doctor_name = Column(String(100), nullable=False)
    doctor_id = Column(Integer)
    department = Column(String(50))
    appointment_date = Column(Date, nullable=False)
    appointment_time = Column(String(20))
    status = Column(String(20), default="Pending")  # Confirmed, Pending, Cancelled
    notes = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())