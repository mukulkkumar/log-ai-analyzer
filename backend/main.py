from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth_user
from database import Base, engine
from routers import users, protected, log
from config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_user.router)
app.include_router(users.router)
app.include_router(protected.router)
app.include_router(log.router)
