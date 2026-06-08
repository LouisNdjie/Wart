"""
demandes.py  (ancien : collectionneur.py → renommé)
Collection : demandes
Le collectionneur n'a pas sa propre collection MongoDB :
ses interactions passent par les demandes d'achat.
Ce fichier modélise donc la collection "demandes".
"""
from pydantic import BaseModel, Field
from typing import Literal, Optional
from datetime import datetime

from .base import MongoBaseModel, PyObjectId


# ---------------------------------------------------------------------------
# Statuts d'une demande
# ---------------------------------------------------------------------------
DemandeStatut = Literal["en_attente", "acceptee", "refusee"]


# ---------------------------------------------------------------------------
# Document complet stocké en base
# ---------------------------------------------------------------------------
class DemandeDB(MongoBaseModel):
    oeuvre_id:     PyObjectId                     # → oeuvres._id
    user_id:       PyObjectId                     # → users._id (collectionneur)
    statut:        DemandeStatut = "en_attente"
    message:       Optional[str] = None           # message optionnel du collectionneur
    prix_snapshot: Optional[float] = None         # prix de l'œuvre au moment de la demande
    created_at:    datetime = Field(default_factory=datetime.utcnow)


# ---------------------------------------------------------------------------
# Payload de création (collectionneur → API)
# ---------------------------------------------------------------------------
class DemandeCreate(BaseModel):
    oeuvre_id: str
    message:   Optional[str] = Field(default=None, max_length=500)


# ---------------------------------------------------------------------------
# Payload de réponse artiste (accepte ou refuse)
# ---------------------------------------------------------------------------
class DemandeReponse(BaseModel):
    statut: Literal["acceptee", "refusee"]