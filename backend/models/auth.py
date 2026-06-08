"""
auth.py
Collection : users
Gère l'inscription, la connexion et les tokens JWT.
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional
from datetime import datetime

from .base import MongoBaseModel, PyObjectId


# ---------------------------------------------------------------------------
# Document complet stocké en base
# ---------------------------------------------------------------------------
class UserDB(MongoBaseModel):
    username:   str
    email:      EmailStr
    password:   str                               # hash bcrypt
    role:       Literal["artiste", "collectionneur", "admin"]
    avatar:     Optional[str] = None
    is_banned:  bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ---------------------------------------------------------------------------
# Payload d'inscription (entrée API)
# ---------------------------------------------------------------------------
class RegisterSchema(BaseModel):
    username: str = Field(min_length=3, max_length=30)
    email:    EmailStr
    password: str = Field(min_length=6)
    role:     Literal["artiste", "collectionneur"]  # l'admin ne s'inscrit pas


# ---------------------------------------------------------------------------
# Payload de connexion
# ---------------------------------------------------------------------------
class LoginSchema(BaseModel):
    email:    EmailStr
    password: str


# ---------------------------------------------------------------------------
# Réponse renvoyée au client après auth
# ---------------------------------------------------------------------------
class TokenResponse(BaseModel):
    access_token:  str
    token_type:    str = "bearer"
    role:          str
    user_id:       str


# ---------------------------------------------------------------------------
# Données exposées dans les routes publiques (jamais le hash)
# ---------------------------------------------------------------------------
class UserPublic(BaseModel):
    id:         PyObjectId = Field(alias="_id")
    username:   str
    email:      EmailStr
    role:       str
    avatar:     Optional[str]
    is_banned:  bool
    created_at: datetime

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}