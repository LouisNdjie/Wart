from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from config.databaseGestion import db

oeuvres_collection = db.oeuvres

class OeuvreCreate(BaseModel):
    titre: str
    medium: str
    annee: Optional[int] = None
    dimensions: Optional[str] = None
    description: Optional[str] = None
    prix: float
    tag: str
    imageUrl: Optional[str] = None
    artiste_id: str                       # ObjectId de l'artiste

class OeuvreUpdate(BaseModel):
    titre: Optional[str] = None
    medium: Optional[str] = None
    annee: Optional[int] = None
    dimensions: Optional[str] = None
    description: Optional[str] = None
    prix: Optional[float] = None
    statut: Optional[str] = None          # "Disponible" | "Réservée" | "Vendue"
    tag: Optional[str] = None
    imageUrl: Optional[str] = None

class OeuvreOut(BaseModel):
    id: str
    titre: str
    medium: str
    annee: Optional[int] = None
    dimensions: Optional[str] = None
    description: Optional[str] = None
    prix: float
    statut: str = "Disponible"
    tag: str
    imageUrl: Optional[str] = None
    likes: int = 0
    artiste_id: str
    created_at: Optional[datetime] = None