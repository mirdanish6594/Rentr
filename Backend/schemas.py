from pydantic import BaseModel
from typing import List, Optional, Union

# --- Applicant ---
class ApplicantBase(BaseModel):
    name: str
    bid: int
    proposal: str
    date: Optional[str] = None

class ApplicantCreate(ApplicantBase):
    pass

class Applicant(ApplicantBase):
    id: int
    job_id: int
    contractor_id: Optional[int] = 101 # Allow this field to be read

    class Config:
        orm_mode = True  # Or 'from_attributes = True' if you see Pydantic V2 warnings

# --- Invoice ---
class InvoiceBase(BaseModel):
    amount: int
    notes: Optional[str] = None
    date: Optional[str] = None

class InvoiceCreate(InvoiceBase):
    pass

class Invoice(InvoiceBase):
    id: str
    job_id: int
    class Config:
        orm_mode = True

# --- Job ---
class JobBase(BaseModel):
    title: str
    type: str
    description: str
    budget: int

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    budget: Optional[int] = None

class Job(JobBase):
    id: int
    status: str
    assigned_to: Optional[str] = None
    applicants: List[Applicant] = []
    invoice: Optional[Invoice] = None

    class Config:
        orm_mode = True