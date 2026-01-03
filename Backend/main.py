from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
import models, schemas, database

# 1. Create tables in the DB (Supabase or Local)
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# 2. CORS: Allow Frontend to talk to Backend
origins = [
    "http://localhost:5173",          # Local React
    "https://rentr.vercel.app",       # Your Vercel Domain
    "https://rentr-module.vercel.app" # Alternate Vercel Domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ROUTES ---

# GET All Jobs
@app.get("/api/jobs", response_model=list[schemas.Job])
def get_jobs(db: Session = Depends(get_db)):
    return db.query(models.Job).order_by(models.Job.id.desc()).all()

# POST Create Job
@app.post("/api/jobs", response_model=schemas.Job)
def create_job(job: schemas.JobCreate, db: Session = Depends(get_db)):
    db_job = models.Job(**job.dict())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

# PUT Edit Job
@app.put("/api/jobs/{job_id}", response_model=schemas.Job)
def update_job(job_id: int, updates: schemas.JobUpdate, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if updates.title: job.title = updates.title
    if updates.type: job.type = updates.type
    if updates.description: job.description = updates.description
    if updates.budget: job.budget = updates.budget
    
    db.commit()
    db.refresh(job)
    return job

# POST Apply for Job
@app.post("/api/jobs/{job_id}/apply")
def apply_for_job(job_id: int, application: schemas.ApplicantCreate, contractorName: str = None, db: Session = Depends(get_db)):
    # Note: If frontend sends 'contractorName' but schema expects 'name', 
    # ensure your frontend sends 'name' or your schema matches.
    new_applicant = models.Applicant(
        job_id=job_id,
        name=application.name, 
        bid=application.bid,
        proposal=application.proposal,
        date=datetime.now().strftime("%Y-%m-%d")
    )
    db.add(new_applicant)
    db.commit()
    return {"success": True}

# POST Assign Contractor
@app.post("/api/jobs/{job_id}/assign")
def assign_job(job_id: int, payload: dict, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job.status = "Assigned"
    job.assigned_to = payload.get("contractorName")
    db.commit()
    return {"success": True}

# POST Update Status (Start/Complete)
@app.post("/api/jobs/{job_id}/status")
def update_status(job_id: int, payload: dict, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job.status = payload.get("status")
    db.commit()
    return {"success": True}

# POST Create Invoice
@app.post("/api/jobs/{job_id}/invoice")
def create_invoice(job_id: int, invoice: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    new_invoice = models.Invoice(
        id=f"INV-{int(datetime.now().timestamp())}",
        job_id=job_id,
        amount=invoice.amount,
        notes=invoice.notes,
        date=datetime.now().isoformat()
    )
    job.status = "Invoiced"
    db.add(new_invoice)
    db.commit()
    return {"success": True}

# POST Pay Invoice
@app.post("/api/jobs/{job_id}/pay")
def pay_invoice(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job.status = "Paid"
    db.commit()
    return {"success": True}

# --- NEW: Contractor Profile Endpoint (Fixes the Profile Page 404) ---
@app.get("/api/contractors/{contractor_id}")
def get_contractor_profile(contractor_id: int):
    # This mock data ensures your Profile page works perfectly
    return {
        "id": contractor_id,
        "name": "Danish Mir",
        "company": "Mir Electrical Solutions",
        "role": "Licensed Electrician",
        "location": "Srinagar, Kashmir",
        "rating": 4.9,
        "reviews": 128,
        "email": "danish@rentr.app",
        "phone": "+91 60056 19812",
        "bio": "Certified industrial and residential electrician with over 8 years of experience. Specializing in smart home automation, generator repair, and complex wiring grids. Committed to safety and efficiency.",
        "completed_jobs": 42,
        "skills": ["Industrial Wiring", "Generators", "Smart Home", "HVAC Repair", "Blueprints"]
    }