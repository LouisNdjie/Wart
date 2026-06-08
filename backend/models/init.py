# models/__init__.py
from .base import MongoBaseModel, PyObjectId
from .auth import UserDB, RegisterSchema, LoginSchema, TokenResponse, UserPublic
from .artistes import ArtisteDB, ArtisteCreate, ArtisteUpdate, ArtistePublic
from .oeuvres import OeuvreDB, OeuvreCreate, OeuvreUpdate, LikeResponse
from .commentaires import CommentaireDB, CommentaireCreate, SignalementResponse
from .demandes import DemandeDB, DemandeCreate, DemandeReponse
from .extras import (
    ExpositionDB, ExpositionCreate, ExpositionUpdate,
    ArticleDB, ArticleCreate, ArticleUpdate,
    QuestionDB, QuestionCreate, ReponseCreate, ReponseEmbed,
    NotificationDB, NotificationCreate,
)
from .admin import DashboardStats, BanAction, ModerationAction, CommentaireSignale

__all__ = [
    "MongoBaseModel", "PyObjectId",
    "UserDB", "RegisterSchema", "LoginSchema", "TokenResponse", "UserPublic",
    "ArtisteDB", "ArtisteCreate", "ArtisteUpdate", "ArtistePublic",
    "OeuvreDB", "OeuvreCreate", "OeuvreUpdate", "LikeResponse",
    "CommentaireDB", "CommentaireCreate", "SignalementResponse",
    "DemandeDB", "DemandeCreate", "DemandeReponse",
    "ExpositionDB", "ExpositionCreate", "ExpositionUpdate",
    "ArticleDB", "ArticleCreate", "ArticleUpdate",
    "QuestionDB", "QuestionCreate", "ReponseCreate", "ReponseEmbed",
    "NotificationDB", "NotificationCreate",
    "DashboardStats", "BanAction", "ModerationAction", "CommentaireSignale",
]