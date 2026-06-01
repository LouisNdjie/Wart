from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from config.databaseGestion import db

commentaires_collection = db.commentaires

class CommentaireCreate(BaseModel):
    message: str
    oeuvre_id: str
    user_id: str

class CommentaireOut(BaseModel):
    id: str
    message: str
    oeuvre_id: str
    user_id: str
    signalements: int = 0
    created_at: Optional[datetime] = None