from sqlalchemy import Column, Integer, String, DateTime, Text, Date
from sqlalchemy.sql import func
from app.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer)
    gender = Column(String(10))
    phone = Column(String(20))
    email = Column(String(100))
    address = Column(Text)
    blood_group = Column(String(5))
    department = Column(String(50))
    doctor_name = Column(String(100))
    status = Column(String(20), default="Outpatient")  # Admitted, Discharged, Critical, Stable
    symptoms = Column(Text)
    diagnosis = Column(Text)
    admission_date = Column(Date)
    discharge_date = Column(Date)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())