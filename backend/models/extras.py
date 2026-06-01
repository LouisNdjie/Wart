from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from config.databaseGestion import db

expositions_collection  = db.expositions
articles_collection     = db.articles
questions_collection    = db.questions
notifications_collection = db.notifications

# ── Expositions ───────────────────────────────────────────────────────────────

class ExpositionCreate(BaseModel):
    title: str
    description: Optional[str] = None
    dates: str
    tag: str
    imageUrl: Optional[str] = None
    artiste_id: Optional[str] = None

class ExpositionOut(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    dates: str
    tag: str
    imageUrl: Optional[str] = None
    statut: str = "en_cours"
    artiste_id: Optional[str] = None
    views: int = 0
    likes: int = 0
    created_at: Optional[datetime] = None

# ── Articles ──────────────────────────────────────────────────────────────────

RUBRIQUES = ["Dans l'Atelier", "Le Manifeste", "Zoom sur...", "La Minute Curieuse", "Questions"]

class ArticleCreate(BaseModel):
    titre: str
    excerpt: Optional[str] = None
    contenu: Optional[str] = None
    rubrique: str
    author: str
    imageColor: Optional[str] = None
    imageUrl: Optional[str] = None
    readTime: Optional[int] = None
    featured: bool = False

class ArticleOut(BaseModel):
    id: str
    titre: str
    excerpt: Optional[str] = None
    contenu: Optional[str] = None
    rubrique: str
    author: str
    imageColor: Optional[str] = None
    imageUrl: Optional[str] = None
    readTime: Optional[int] = None
    featured: bool = False
    created_at: Optional[datetime] = None

# ── Questions ─────────────────────────────────────────────────────────────────

class ReponseCreate(BaseModel):
    message: str
    user_id: str

class QuestionCreate(BaseModel):
    question: str
    user_id: str

class QuestionOut(BaseModel):
    id: str
    question: str
    user_id: str
    reponses: List[dict] = []
    created_at: Optional[datetime] = None

# ── Notifications ─────────────────────────────────────────────────────────────

class NotificationOut(BaseModel):
    id: str
    user_id: str
    type: str                             # "info" | "achat" | "question" | "news"
    message: str
    read: bool = False
    ref_id: Optional[str] = None
    ref_type: Optional[str] = None
    created_at: Optional[datetime] = None