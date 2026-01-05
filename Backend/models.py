from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    type = Column(String)
    description = Column(String)
    budget = Column(Integer)
    status = Column(String, default="Open")
    assigned_to = Column(String, nullable=True)
    
    # Relationships
    applicants = relationship("Applicant", back_populates="job")
    invoice = relationship("Invoice", uselist=False, back_populates="job")

class Applicant(Base):
    __tablename__ = "applicants"
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    contractor_id = Column(Integer) 
    name = Column(String)
    bid = Column(Integer)
    proposal = Column(String)
    date = Column(String)
    
    job = relationship("Job", back_populates="applicants")

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(String, primary_key=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    amount = Column(Integer)
    notes = Column(String)
    date = Column(String)
    job = relationship("Job", back_populates="invoice")