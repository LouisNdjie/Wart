from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from config.databaseGestion import db

artistes_collection = db.artistes

class ArtisteCreate(BaseModel):
    artistName: str
    artistHandle: str
    tag: str
    artistProfile: str
    artistAvatar: Optional[str] = None
    artistPaints: Optional[List[str]] = []
    user_id: str                          # ObjectId de l'utilisateur lié

class ArtisteOut(BaseModel):
    id: str
    artistName: str
    artistHandle: str
    tag: str
    artistProfile: str
    artistAvatar: Optional[str] = None
    artistPaints: Optional[List[str]] = []
    user_id: str
    created_at: Optional[datetime] = None