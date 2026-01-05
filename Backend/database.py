from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# 1. Use the URL from the computer's environment, OR fallback to a local file
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./rentr.db")

# 2. Fix a small issue between Render/Supabase names
if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# 3. Connect to the database
if "sqlite" in SQLALCHEMY_DATABASE_URL:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,  # ADDS RESILIENCE: Checks connection before use
        pool_size=10,        # Keeps 10 connections open
        max_overflow=20      # Allows spiking up to 20 more
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()