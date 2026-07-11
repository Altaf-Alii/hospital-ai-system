from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, patients, doctors, appointments, ai_prediction

# Database tables banao
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hospital AI System",
    description="Production Ready Hospital Management System with AI",
    version="1.0.0"
)

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes include karo
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(doctors.router)
app.include_router(appointments.router)
app.include_router(ai_prediction.router)

@app.get("/")
def home():
    return {
        "message": "🏥 Hospital AI System API Ready!",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/dashboard/stats")
def get_stats(db = None):
    from app.database import SessionLocal
    from app.models.patient import Patient
    from app.models.doctor import Doctor
    from app.models.appointment import Appointment
    
    db = SessionLocal()
    try:
        total_patients = db.query(Patient).count()
        total_doctors = db.query(Doctor).count()
        total_appointments = db.query(Appointment).count()
        admitted_patients = db.query(Patient).filter(Patient.status == "Admitted").count()
        
        return {
            "total_patients": total_patients,
            "total_doctors": total_doctors,
            "total_appointments": total_appointments,
            "admitted_patients": admitted_patients
        }
    finally:
        db.close()