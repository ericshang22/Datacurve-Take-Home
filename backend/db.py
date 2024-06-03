from sqlalchemy import create_engine, Column, Integer, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# One table database that contains all submitted code and corresponding output

class Submissions(Base):
    __tablename__ = "submissions"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(Text, index=True)
    output = Column(Text, index=True)
