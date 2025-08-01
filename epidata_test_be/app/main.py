from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.presentation.controllers.task_controller import router as task_router
from app.config.settings import settings
from app.infrastructure.db.models.session import engine
from app.infrastructure.db.models.task_model import Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(task_router, prefix="/api", tags=["Tasks"])