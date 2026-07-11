from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    specialization = Column(String(100))
    experience = Column(String(20))
    phone = Column(String(20))
    email = Column(String(100), unique=True)
    department = Column(String(50))
    availability = Column(Boolean, default=True)
    patients_count = Column(Integer, default=0)
    qualification = Column(String(100))
    bio = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())