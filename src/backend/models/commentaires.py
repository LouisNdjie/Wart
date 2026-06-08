"""
commentaires.py  (ancien : comment.py → renommé pour coller à la collection)
Collection : commentaires
Inclut le système de signalement (champs signalements + signale_par).
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

from .base import MongoBaseModel, PyObjectId


# ---------------------------------------------------------------------------
# Document complet stocké en base
# ---------------------------------------------------------------------------
class CommentaireDB(MongoBaseModel):
    message:      str
    oeuvre_id:    PyObjectId                      # → oeuvres._id
    user_id:      PyObjectId                      # → users._id
    signalements: int = 0                         # compteur de signalements
    signale_par:  List[PyObjectId] = Field(default_factory=list)  # user_ids ayant signalé
    created_at:   datetime = Field(default_factory=datetime.utcnow)


# ---------------------------------------------------------------------------
# Payload de création
# ---------------------------------------------------------------------------
class CommentaireCreate(BaseModel):
    message:   str = Field(min_length=1, max_length=2000)
    oeuvre_id: str


# ---------------------------------------------------------------------------
# Réponse signalement
# ---------------------------------------------------------------------------
class SignalementResponse(BaseModel):
    commentaire_id: str
    signalements:   int
    signale:        bool                          # True = signalement ajouté