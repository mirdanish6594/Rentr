from fastapi import FastAPI, Depends, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from pydantic import BaseModel
from typing import Union, List
import models, schemas, database
import logging

# Set up logging to see errors in the terminal
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# It only creates tables if they don't exist yet.
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Allow Frontend to talk to Backend
origins = [
    "http://localhost:5173",          
    "https://rentr.vercel.app",       
    "https://rentr-module.vercel.app" 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- SCHEMA FOR APPLICATIONS ---
class ApplicationSchema(BaseModel):
    bid: Union[str, int]
    proposal: str
    contractorName: str

# --- ROUTES ---
@app.get("/api/jobs", response_model=List[schemas.Job])
def get_jobs(db: Session = Depends(get_db)):
    # joinedload ensures applicants are fetched with the job
    return db.query(models.Job).options(joinedload(models.Job.applicants)).order_by(models.Job.id.desc()).all()

@app.post("/api/jobs", response_model=schemas.Job)
def create_job(job: schemas.JobCreate, db: Session = Depends(get_db)):
    db_job = models.Job(**job.dict())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

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

@app.delete("/api/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    db.delete(job)
    db.commit()
    return {"success": True, "message": "Job deleted"}

@app.post("/api/jobs/{job_id}/apply")
def apply_for_job(job_id: int, data: ApplicationSchema, db: Session = Depends(get_db)):
    try:
        bid_amount = int(data.bid)

        new_applicant = models.Applicant(
            job_id=job_id,
            name=data.contractorName, 
            contractor_id=101,  
            bid=bid_amount,
            proposal=data.proposal,
            date=datetime.now().strftime("%Y-%m-%d")
        )
        
        db.add(new_applicant)
        db.commit()
        return {"success": True}
        
    except Exception as e:
        logger.error(f"Error applying for job: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/jobs/{job_id}/assign")
def assign_job(job_id: int, payload: dict, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job.status = "Assigned"
    job.assigned_to = payload.get("contractorName")
    db.commit()
    return {"success": True}

@app.post("/api/jobs/{job_id}/status")
def update_status(job_id: int, payload: dict, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job.status = payload.get("status")
    db.commit()
    return {"success": True}

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

@app.post("/api/jobs/{job_id}/pay")
def pay_invoice(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job.status = "Paid"
    db.commit()
    return {"success": True}

@app.get("/api/contractors/{contractor_id}")
def get_contractor_profile(contractor_id: int):
    users = {
        101: {
            "id": 101,
            "name": "Danish Mir",
            "company": "Mir Solutions",
            "role": "Licensed Electrician",
            "location": "Srinagar, Kashmir",
            "rating": 4.9,
            "reviews": 128,
            "email": "danish@rentr.app",
            "phone": "+91 60056 19812",
            "bio": "Certified industrial and residential electrician with over 8 years of experience. Specializing in smart home automation.",
            "completed_jobs": 42,
            "skills": ["Industrial Wiring", "Generators", "Smart Home", "HVAC Repair"]
        },
        102: {
            "id": 102,
            "name": "Agent Smith",
            "company": "Matrix Realty Group",
            "role": "Property Manager",
            "location": "New York, USA",
            "rating": 5.0,
            "reviews": 85,
            "email": "smith@matrixrealty.com",
            "phone": "+1 212 555 0199",
            "bio": "Senior property manager overseeing 50+ commercial and residential units. Focused on quick turnaround and quality maintenance.",
            "completed_jobs": 150,
            "skills": ["Property Management", "Contract Negotiation", "Real Estate", "Logistics"]
        }
    }
    return users.get(contractor_id, users[101])