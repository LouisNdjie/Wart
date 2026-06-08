"""
oeuvres.py  (ancien : oeuvre.py → renommé au pluriel pour coller à la collection)
Collection : oeuvres
Les likes sont embarqués dans ce document (champs likes + likedBy).
→ plus de fichier like.py séparé.
"""
from pydantic import BaseModel, Field
from typing import List, Literal, Optional
from datetime import datetime

from .base import MongoBaseModel, PyObjectId


# ---------------------------------------------------------------------------
# Statuts possibles d'une œuvre
# ---------------------------------------------------------------------------
OeuvreStatut = Literal["Disponible", "Réservée", "Vendue"]


# ---------------------------------------------------------------------------
# Document complet stocké en base
# ---------------------------------------------------------------------------
class OeuvreDB(MongoBaseModel):
    titre:       str
    medium:      str                              # peinture, sculpture…
    annee:       Optional[int] = None
    dimensions:  Optional[str] = None
    description: Optional[str] = None
    prix:        float
    statut:      OeuvreStatut = "Disponible"
    tag:         str
    imageUrl:    Optional[str] = None
    likes:       int = 0
    likedBy:     List[PyObjectId] = Field(default_factory=list)   # user_ids ayant liké
    artiste_id:  PyObjectId                       # → artistes._id
    created_at:  datetime = Field(default_factory=datetime.utcnow)


# ---------------------------------------------------------------------------
# Payload de création
# ---------------------------------------------------------------------------
class OeuvreCreate(BaseModel):
    titre:       str = Field(min_length=1, max_length=200)
    medium:      str
    annee:       Optional[int] = Field(default=None, ge=1000, le=2100)
    dimensions:  Optional[str] = None
    description: Optional[str] = None
    prix:        float = Field(gt=0)
    tag:         str
    imageUrl:    Optional[str] = None


# ---------------------------------------------------------------------------
# Payload de mise à jour
# ---------------------------------------------------------------------------
class OeuvreUpdate(BaseModel):
    titre:       Optional[str] = None
    medium:      Optional[str] = None
    annee:       Optional[int] = None
    dimensions:  Optional[str] = None
    description: Optional[str] = None
    prix:        Optional[float] = Field(default=None, gt=0)
    statut:      Optional[OeuvreStatut] = None
    tag:         Optional[str] = None
    imageUrl:    Optional[str] = None


# ---------------------------------------------------------------------------
# Réponse like/unlike (retour de route)
# ---------------------------------------------------------------------------
class LikeResponse(BaseModel):
    oeuvre_id: str
    likes:     int
    liked:     bool                               # True = like ajouté, False = retiré