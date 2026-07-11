from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Hospital AI System"
    SECRET_KEY: str = "hospital-secret-key-2024-very-secure"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    DATABASE_URL: str = "mysql+pymysql://root:23bscs85@localhost/hospital_db"

settings = Settings()