import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Log Analyzer"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "CHANGE_ME_TO_A_LONG_RANDOM_SECRET")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")   
    ALGORITHM: str = "HS256"

    # Token expiry times
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")

    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    class Config:
        env_file = ".env"

settings = Settings()
