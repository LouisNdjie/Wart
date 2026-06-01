from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from config.databaseGestion import db

demandes_collection = db.demandes

class DemandeCreate(BaseModel):
    oeuvre_id: str
    user_id: str
    message: Optional[str] = None
    prix_snapshot: Optional[float] = None

class DemandeOut(BaseModel):
    id: str
    oeuvre_id: str
    user_id: str
    statut: str = "en_attente"            # "en_attente" | "acceptee" | "refusee"
    message: Optional[str] = None
    prix_snapshot: Optional[float] = None
    created_at: Optional[datetime] = None