"""
admin.py
Pas de collection dédiée — l'admin opère sur toutes les collections.
Ce fichier contient les schémas de réponse du dashboard et de modération.
"""
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from .base import PyObjectId


# ---------------------------------------------------------------------------
# Dashboard stats (GET /admin/stats)
# ---------------------------------------------------------------------------
class DashboardStats(BaseModel):
    total_users:       int
    total_artistes:    int
    total_oeuvres:     int
    total_demandes:    int
    demandes_en_attente: int
    total_commentaires:  int
    commentaires_signales: int    # signalements >= 1
    total_expositions: int
    total_articles:    int


# ---------------------------------------------------------------------------
# Bannissement d'un utilisateur
# ---------------------------------------------------------------------------
class BanAction(BaseModel):
    user_id:  str
    is_banned: bool                               # True = bannir, False = débannir
    reason:   Optional[str] = None


# ---------------------------------------------------------------------------
# Suppression de commentaire signalé
# ---------------------------------------------------------------------------
class ModerationAction(BaseModel):
    commentaire_id: str
    action: str                                   # "delete" | "ignore"


# ---------------------------------------------------------------------------
# Vue commentaire signalé pour le panel admin
# ---------------------------------------------------------------------------
class CommentaireSignale(BaseModel):
    id:           PyObjectId
    message:      str
    user_id:      PyObjectId
    oeuvre_id:    PyObjectId
    signalements: int
    created_at:   datetime

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}