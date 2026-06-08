"""
artistes.py
Collection : artistes
Profil enrichi de l'artiste, lié à users via user_id.
Un utilisateur de rôle "artiste" possède exactement un document ici.
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

from .base import MongoBaseModel, PyObjectId


# ---------------------------------------------------------------------------
# Document complet stocké en base
# ---------------------------------------------------------------------------
class ArtisteDB(MongoBaseModel):
    artistName:    str
    artistHandle:  str                            # @handle unique
    tag:           str                            # catégorie / style
    artistProfile: str                            # bio
    artistAvatar:  Optional[str] = None
    artistPaints:  List[str] = Field(default_factory=list)  # URLs images portfolio
    user_id:       PyObjectId                     # → users._id
    created_at:    datetime = Field(default_factory=datetime.utcnow)


# ---------------------------------------------------------------------------
# Payload de création de profil artiste (après inscription)
# ---------------------------------------------------------------------------
class ArtisteCreate(BaseModel):
    artistName:    str = Field(min_length=2, max_length=80)
    artistHandle:  str = Field(min_length=2, max_length=30, pattern=r"^[a-z0-9_]+$")
    tag:           str
    artistProfile: str = Field(max_length=1000)
    artistAvatar:  Optional[str] = None
    artistPaints:  List[str] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Payload de mise à jour (tous les champs optionnels)
# ---------------------------------------------------------------------------
class ArtisteUpdate(BaseModel):
    artistName:    Optional[str] = None
    artistHandle:  Optional[str] = None
    tag:           Optional[str] = None
    artistProfile: Optional[str] = None
    artistAvatar:  Optional[str] = None
    artistPaints:  Optional[List[str]] = None


# ---------------------------------------------------------------------------
# Vue publique renvoyée au client
# ---------------------------------------------------------------------------
class ArtistePublic(ArtisteDB):
    pass                                          # expose tout sauf _id alias géré par MongoBaseModel