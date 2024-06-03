from litestar import Litestar, post, get
from litestar.di import Provide
from litestar.params import Body
from sqlalchemy.orm import Session
from pydantic import BaseModel
from litestar.config.cors import CORSConfig
from db import SessionLocal, Submissions

# allow requests from localhost frontend
cors_config = CORSConfig(allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


# data model for a code run submission
class CodeRun(BaseModel):
    code: str
    output: str


async def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# submission POST API
@post("/submit/")
async def submit(data: CodeRun, db: Session = Provide(get_db)) -> str:
    code = data.code
    output = data.output

    code_run = Submissions(code=code, output=output)
    db.add(code_run)
    db.commit()
    db.refresh(code_run)
    return "Successful Submission"


# View all previous submissions with GET method
@get("/submissions/")
async def read_submissions(db: Session = Provide(get_db)) -> list[CodeRun]:
    code_runs = db.query(Submissions).all()
    return [CodeRun(code=run.code, output=run.output) for run in code_runs]


# Empty the table
@get("/clear/")
async def delete_submissions(db: Session = Provide(get_db)) -> str:
    code_runs = db.query(Submissions).delete()
    db.commit()
    return "Successful Deletion"


app = Litestar(
    route_handlers=[submit, read_submissions, delete_submissions],
    dependencies={"db": Provide(get_db)},
    cors_config=cors_config,
)
