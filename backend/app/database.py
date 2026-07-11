from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# MySQL Connection
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:23bscs85@localhost/hospital_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()