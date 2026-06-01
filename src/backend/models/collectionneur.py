from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
from config.databaseGestion import db

users_collection = db.users

# ── Schémas de validation ──────────────────────────────────────────────────────

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str = "collectionneur"          # "artiste" | "collectionneur" | "admin"
    avatar: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: str
    username: str
    email: str
    role: str
    avatar: Optional[str] = None
    is_banned: bool = False
    created_at: Optional[datetime] = None