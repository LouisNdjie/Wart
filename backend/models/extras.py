"""
extras.py
Collections : expositions · articles · questions · notifications
Regroupées ici car ce sont des collections secondaires / de contenu éditorial.
"""
from pydantic import BaseModel, Field
from typing import List, Literal, Optional
from datetime import datetime

from .base import MongoBaseModel, PyObjectId


# ===========================================================================
# EXPOSITIONS
# ===========================================================================
ExpositionStatut = Literal["en_cours", "archive"]


class ExpositionDB(MongoBaseModel):
    title:       str
    description: Optional[str] = None
    dates:       str                              # ex : "12 juin – 30 août 2025"
    tag:         str
    imageUrl:    Optional[str] = None
    statut:      ExpositionStatut = "en_cours"
    artiste_id:  Optional[PyObjectId] = None      # optionnel (expo collective)
    views:       int = 0
    likes:       int = 0
    created_at:  datetime = Field(default_factory=datetime.utcnow)


class ExpositionCreate(BaseModel):
    title:       str = Field(min_length=2, max_length=200)
    description: Optional[str] = None
    dates:       str
    tag:         str
    imageUrl:    Optional[str] = None
    artiste_id:  Optional[str] = None


class ExpositionUpdate(BaseModel):
    title:       Optional[str] = None
    description: Optional[str] = None
    dates:       Optional[str] = None
    tag:         Optional[str] = None
    imageUrl:    Optional[str] = None
    statut:      Optional[ExpositionStatut] = None


# ===========================================================================
# ARTICLES
# ===========================================================================
ArticleRubrique = Literal[
    "Dans l'Atelier",
    "Le Manifeste",
    "Zoom sur...",
    "La Minute Curieuse",
    "Questions",
]


class ArticleDB(MongoBaseModel):
    titre:      str
    excerpt:    Optional[str] = None
    contenu:    Optional[str] = None
    rubrique:   ArticleRubrique
    author:     str                               # nom affiché (pas forcément user_id)
    imageColor: Optional[str] = None             # couleur de fond si pas d'image
    imageUrl:   Optional[str] = None
    readTime:   Optional[int] = None             # minutes de lecture estimées
    featured:   bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ArticleCreate(BaseModel):
    titre:      str = Field(min_length=2, max_length=300)
    excerpt:    Optional[str] = Field(default=None, max_length=500)
    contenu:    Optional[str] = None
    rubrique:   ArticleRubrique
    author:     str
    imageColor: Optional[str] = None
    imageUrl:   Optional[str] = None
    readTime:   Optional[int] = Field(default=None, ge=1)
    featured:   bool = False


class ArticleUpdate(BaseModel):
    titre:      Optional[str] = None
    excerpt:    Optional[str] = None
    contenu:    Optional[str] = None
    rubrique:   Optional[ArticleRubrique] = None
    imageColor: Optional[str] = None
    imageUrl:   Optional[str] = None
    readTime:   Optional[int] = None
    featured:   Optional[bool] = None


# ===========================================================================
# QUESTIONS  (forum Q&A embarqué)
# ===========================================================================
class ReponseEmbed(BaseModel):
    """Réponse embarquée dans le document question (pas de collection séparée)."""
    message:    str
    user_id:    PyObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"arbitrary_types_allowed": True}


class QuestionDB(MongoBaseModel):
    question:   str
    user_id:    PyObjectId                        # → users._id
    reponses:   List[ReponseEmbed] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class QuestionCreate(BaseModel):
    question: str = Field(min_length=10, max_length=1000)


class ReponseCreate(BaseModel):
    message: str = Field(min_length=1, max_length=2000)


# ===========================================================================
# NOTIFICATIONS
# ===========================================================================
NotifType    = Literal["info", "achat", "question", "news"]
NotifRefType = Literal["oeuvre", "demande", "question", "article"]


class NotificationDB(MongoBaseModel):
    user_id:    PyObjectId                        # destinataire
    type:       NotifType
    message:    str
    read:       bool = False
    ref_id:     Optional[PyObjectId] = None      # document référencé
    ref_type:   Optional[NotifRefType] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class NotificationCreate(BaseModel):
    """Utilisé en interne par le backend pour créer une notif."""
    user_id:  str
    type:     NotifType
    message:  str
    ref_id:   Optional[str] = None
    ref_type: Optional[NotifRefType] = None