from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
from bson import ObjectId

# ── Config & utils ─────────────────────────────────────────────────────────────
from config.databaseGestion import db
from utils.helpers import (
    serialize_doc, to_object_id,
    hash_password, verify_password,
    create_token,
)
from utils.auth import get_current_user, require_admin, require_artiste

# ── Modèles ────────────────────────────────────────────────────────────────────
from models.user        import users_collection,          UserCreate, UserLogin
from models.artiste     import artistes_collection,       ArtisteCreate
from models.oeuvre      import oeuvres_collection,        OeuvreCreate, OeuvreUpdate
from models.commentaire import commentaires_collection,   CommentaireCreate
from models.demande     import demandes_collection,       DemandeCreate
from models.extras      import (
    expositions_collection,  ExpositionCreate,
    articles_collection,     ArticleCreate,
    questions_collection,    QuestionCreate, ReponseCreate,
    notifications_collection,
)

# ══════════════════════════════════════════════════════════════════════════════
app = FastAPI(title="Wart Gallery API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Helper interne ─────────────────────────────────────────────────────────────
def now() -> datetime:
    return datetime.now(timezone.utc)

async def _create_notification(user_id: str, type_: str, message: str,
                                ref_id: str = None, ref_type: str = None):
    """Crée une notification en base (fire-and-forget)."""
    doc = {
        "user_id":    to_object_id(user_id),
        "type":       type_,
        "message":    message,
        "read":       False,
        "created_at": now(),
    }
    if ref_id:    doc["ref_id"]   = to_object_id(ref_id)
    if ref_type:  doc["ref_type"] = ref_type
    await notifications_collection.insert_one(doc)


# ══════════════════════════════════════════════════════════════════════════════
# AUTH
# ══════════════════════════════════════════════════════════════════════════════

@app.post("/api/auth/register", tags=["Auth"])
async def register(body: UserCreate):
    """Inscription d'un nouvel utilisateur (artiste ou collectionneur)."""
    if body.role not in ("artiste", "collectionneur"):
        raise HTTPException(400, "Rôle invalide. Choisissez 'artiste' ou 'collectionneur'.")

    if await users_collection.find_one({"email": body.email}):
        raise HTTPException(400, "Email déjà utilisé.")
    if await users_collection.find_one({"username": body.username}):
        raise HTTPException(400, "Nom d'utilisateur déjà pris.")

    doc = {
        "username":   body.username,
        "email":      body.email,
        "password":   hash_password(body.password),
        "role":       body.role,
        "avatar":     body.avatar,
        "is_banned":  False,
        "created_at": now(),
    }
    result = await users_collection.insert_one(doc)
    token  = create_token(str(result.inserted_id), body.role)
    return {"token": token, "role": body.role, "id": str(result.inserted_id)}


@app.post("/api/auth/login", tags=["Auth"])
async def login(body: UserLogin):
    """Connexion — retourne un JWT."""
    user = await users_collection.find_one({"email": body.email})
    if not user or not verify_password(body.password, user["password"]):
        raise HTTPException(401, "Email ou mot de passe incorrect.")
    if user.get("is_banned"):
        raise HTTPException(403, "Ce compte a été banni.")

    token = create_token(str(user["_id"]), user["role"])
    return {"token": token, "role": user["role"], "id": str(user["_id"]),
            "username": user["username"]}


@app.post("/api/auth/admin/login", tags=["Auth"])
async def admin_login(body: UserLogin):
    """Connexion dédiée à l'interface admin (AdminLogin.tsx)."""
    user = await users_collection.find_one({"email": body.email, "role": "admin"})
    if not user or not verify_password(body.password, user["password"]):
        raise HTTPException(401, "Identifiants administrateur incorrects.")

    token = create_token(str(user["_id"]), "admin")
    return {"token": token, "role": "admin", "id": str(user["_id"]),
            "username": user["username"]}


@app.get("/api/auth/me", tags=["Auth"])
async def me(user: dict = Depends(get_current_user)):
    """Profil de l'utilisateur connecté."""
    doc = await users_collection.find_one({"_id": to_object_id(user["sub"])})
    if not doc:
        raise HTTPException(404, "Utilisateur introuvable.")
    return serialize_doc(doc)


# ══════════════════════════════════════════════════════════════════════════════
# ARTISTES
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/artistes", tags=["Artistes"])
async def list_artistes():
    """Liste tous les profils artistes."""
    docs = await artistes_collection.find().sort("created_at", -1).to_list(100)
    return [serialize_doc(d) for d in docs]


@app.get("/api/artistes/{artiste_id}", tags=["Artistes"])
async def get_artiste(artiste_id: str):
    doc = await artistes_collection.find_one({"_id": to_object_id(artiste_id)})
    if not doc:
        raise HTTPException(404, "Artiste introuvable.")
    return serialize_doc(doc)


@app.post("/api/artistes", tags=["Artistes"])
async def create_artiste(body: ArtisteCreate, user: dict = Depends(require_artiste)):
    """Crée un profil artiste lié à l'utilisateur connecté."""
    doc = body.model_dump()
    doc["user_id"]    = to_object_id(body.user_id)
    doc["created_at"] = now()
    result = await artistes_collection.insert_one(doc)
    return {"message": "Profil artiste créé.", "id": str(result.inserted_id)}


@app.put("/api/artistes/{artiste_id}", tags=["Artistes"])
async def update_artiste(artiste_id: str, body: ArtisteCreate,
                         user: dict = Depends(require_artiste)):
    existing = await artistes_collection.find_one({"_id": to_object_id(artiste_id)})
    if not existing:
        raise HTTPException(404, "Artiste introuvable.")

    update = {k: v for k, v in body.model_dump().items() if v is not None}
    if "user_id" in update:
        update["user_id"] = to_object_id(update["user_id"])

    await artistes_collection.update_one(
        {"_id": to_object_id(artiste_id)}, {"$set": update}
    )
    return {"message": "Profil artiste mis à jour."}


# ══════════════════════════════════════════════════════════════════════════════
# OEUVRES
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/oeuvres", tags=["Oeuvres"])
async def list_oeuvres(statut: str = None, tag: str = None, artiste_id: str = None):
    """Liste les oeuvres avec filtres optionnels."""
    query = {}
    if statut:     query["statut"]     = statut
    if tag:        query["tag"]        = tag
    if artiste_id: query["artiste_id"] = to_object_id(artiste_id)

    docs = await oeuvres_collection.find(query).sort("created_at", -1).to_list(200)
    return [serialize_doc(d) for d in docs]


@app.get("/api/oeuvres/{oeuvre_id}", tags=["Oeuvres"])
async def get_oeuvre(oeuvre_id: str):
    doc = await oeuvres_collection.find_one({"_id": to_object_id(oeuvre_id)})
    if not doc:
        raise HTTPException(404, "Oeuvre introuvable.")
    return serialize_doc(doc)


@app.post("/api/oeuvres", tags=["Oeuvres"])
async def create_oeuvre(body: OeuvreCreate, user: dict = Depends(require_artiste)):
    doc = body.model_dump()
    doc["artiste_id"] = to_object_id(body.artiste_id)
    doc["statut"]     = "Disponible"
    doc["likes"]      = 0
    doc["likedBy"]    = []
    doc["created_at"] = now()
    result = await oeuvres_collection.insert_one(doc)
    return {"message": "Oeuvre ajoutée.", "id": str(result.inserted_id)}


@app.put("/api/oeuvres/{oeuvre_id}", tags=["Oeuvres"])
async def update_oeuvre(oeuvre_id: str, body: OeuvreUpdate,
                        user: dict = Depends(require_artiste)):
    update = {k: v for k, v in body.model_dump().items() if v is not None}
    if not update:
        raise HTTPException(400, "Aucun champ à mettre à jour.")
    await oeuvres_collection.update_one(
        {"_id": to_object_id(oeuvre_id)}, {"$set": update}
    )
    return {"message": "Oeuvre mise à jour."}


@app.delete("/api/oeuvres/{oeuvre_id}", tags=["Oeuvres"])
async def delete_oeuvre(oeuvre_id: str, user: dict = Depends(require_artiste)):
    result = await oeuvres_collection.delete_one({"_id": to_object_id(oeuvre_id)})
    if result.deleted_count == 0:
        raise HTTPException(404, "Oeuvre introuvable.")
    return {"message": "Oeuvre supprimée."}


@app.post("/api/oeuvres/{oeuvre_id}/like", tags=["Oeuvres"])
async def toggle_like(oeuvre_id: str, user: dict = Depends(get_current_user)):
    """Like / unlike une oeuvre."""
    uid = to_object_id(user["sub"])
    oid = to_object_id(oeuvre_id)
    doc = await oeuvres_collection.find_one({"_id": oid})
    if not doc:
        raise HTTPException(404, "Oeuvre introuvable.")

    already_liked = uid in (doc.get("likedBy") or [])
    if already_liked:
        await oeuvres_collection.update_one(
            {"_id": oid},
            {"$inc": {"likes": -1}, "$pull": {"likedBy": uid}}
        )
        return {"liked": False}
    else:
        await oeuvres_collection.update_one(
            {"_id": oid},
            {"$inc": {"likes": 1}, "$addToSet": {"likedBy": uid}}
        )
        return {"liked": True}


# ══════════════════════════════════════════════════════════════════════════════
# COMMENTAIRES
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/oeuvres/{oeuvre_id}/commentaires", tags=["Commentaires"])
async def get_commentaires(oeuvre_id: str):
    docs = await commentaires_collection.find(
        {"oeuvre_id": to_object_id(oeuvre_id)}
    ).sort("created_at", -1).to_list(100)
    return [serialize_doc(d) for d in docs]


@app.post("/api/commentaires", tags=["Commentaires"])
async def add_commentaire(body: CommentaireCreate, user: dict = Depends(get_current_user)):
    doc = {
        "message":      body.message,
        "oeuvre_id":    to_object_id(body.oeuvre_id),
        "user_id":      to_object_id(body.user_id),
        "signalements": 0,
        "signale_par":  [],
        "created_at":   now(),
    }
    result = await commentaires_collection.insert_one(doc)
    return {"message": "Commentaire ajouté.", "id": str(result.inserted_id)}


@app.post("/api/commentaires/{comment_id}/signaler", tags=["Commentaires"])
async def signaler_commentaire(comment_id: str, user: dict = Depends(get_current_user)):
    """Signale un commentaire (un seul signalement par utilisateur)."""
    uid = to_object_id(user["sub"])
    cid = to_object_id(comment_id)
    doc = await commentaires_collection.find_one({"_id": cid})
    if not doc:
        raise HTTPException(404, "Commentaire introuvable.")
    if uid in (doc.get("signale_par") or []):
        raise HTTPException(400, "Vous avez déjà signalé ce commentaire.")

    await commentaires_collection.update_one(
        {"_id": cid},
        {"$inc": {"signalements": 1}, "$addToSet": {"signale_par": uid}}
    )
    return {"message": "Commentaire signalé."}


@app.delete("/api/commentaires/{comment_id}", tags=["Commentaires"])
async def delete_commentaire(comment_id: str, user: dict = Depends(require_admin)):
    result = await commentaires_collection.delete_one({"_id": to_object_id(comment_id)})
    if result.deleted_count == 0:
        raise HTTPException(404, "Commentaire introuvable.")
    return {"message": "Commentaire supprimé."}


# ══════════════════════════════════════════════════════════════════════════════
# DEMANDES D'ACHAT
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/demandes", tags=["Demandes"])
async def list_demandes(statut: str = None, user: dict = Depends(require_admin)):
    """Admin : liste toutes les demandes d'achat."""
    query = {}
    if statut: query["statut"] = statut
    docs = await demandes_collection.find(query).sort("created_at", -1).to_list(200)
    return [serialize_doc(d) for d in docs]


@app.get("/api/demandes/me", tags=["Demandes"])
async def my_demandes(user: dict = Depends(get_current_user)):
    """Demandes de l'utilisateur connecté."""
    docs = await demandes_collection.find(
        {"user_id": to_object_id(user["sub"])}
    ).sort("created_at", -1).to_list(50)
    return [serialize_doc(d) for d in docs]


@app.post("/api/demandes", tags=["Demandes"])
async def create_demande(body: DemandeCreate, user: dict = Depends(get_current_user)):
    # Récupère le prix courant de l'oeuvre si pas fourni
    prix_snapshot = body.prix_snapshot
    if not prix_snapshot:
        oeuvre = await oeuvres_collection.find_one({"_id": to_object_id(body.oeuvre_id)})
        if oeuvre:
            prix_snapshot = oeuvre.get("prix")

    doc = {
        "oeuvre_id":     to_object_id(body.oeuvre_id),
        "user_id":       to_object_id(body.user_id),
        "statut":        "en_attente",
        "message":       body.message,
        "prix_snapshot": prix_snapshot,
        "created_at":    now(),
    }
    result = await demandes_collection.insert_one(doc)

    # Notification à l'artiste (via l'oeuvre)
    if oeuvre := await oeuvres_collection.find_one({"_id": to_object_id(body.oeuvre_id)}):
        artiste = await artistes_collection.find_one({"_id": oeuvre["artiste_id"]})
        if artiste:
            await _create_notification(
                str(artiste["user_id"]), "achat",
                f"Nouvelle demande d'achat pour « {oeuvre.get('titre', '')} »",
                ref_id=str(result.inserted_id), ref_type="demande"
            )

    return {"message": "Demande envoyée.", "id": str(result.inserted_id)}


@app.patch("/api/demandes/{demande_id}/statut", tags=["Demandes"])
async def update_demande_statut(demande_id: str, statut: str,
                                user: dict = Depends(require_admin)):
    """Admin : accepte ou refuse une demande."""
    if statut not in ("acceptee", "refusee"):
        raise HTTPException(400, "Statut invalide.")
    await demandes_collection.update_one(
        {"_id": to_object_id(demande_id)}, {"$set": {"statut": statut}}
    )
    return {"message": f"Demande {statut}."}


# ══════════════════════════════════════════════════════════════════════════════
# EXPOSITIONS
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/expositions", tags=["Expositions"])
async def list_expositions(statut: str = None):
    query = {}
    if statut: query["statut"] = statut
    docs = await expositions_collection.find(query).sort("created_at", -1).to_list(100)
    return [serialize_doc(d) for d in docs]


@app.get("/api/expositions/{expo_id}", tags=["Expositions"])
async def get_exposition(expo_id: str):
    doc = await expositions_collection.find_one({"_id": to_object_id(expo_id)})
    if not doc:
        raise HTTPException(404, "Exposition introuvable.")
    # Incrémente les vues
    await expositions_collection.update_one({"_id": to_object_id(expo_id)}, {"$inc": {"views": 1}})
    return serialize_doc(doc)


@app.post("/api/expositions", tags=["Expositions"])
async def create_exposition(body: ExpositionCreate, user: dict = Depends(require_admin)):
    doc = body.model_dump()
    if doc.get("artiste_id"):
        doc["artiste_id"] = to_object_id(doc["artiste_id"])
    doc["statut"]     = "en_cours"
    doc["views"]      = 0
    doc["likes"]      = 0
    doc["created_at"] = now()
    result = await expositions_collection.insert_one(doc)
    return {"message": "Exposition créée.", "id": str(result.inserted_id)}


# ══════════════════════════════════════════════════════════════════════════════
# ARTICLES
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/articles", tags=["Articles"])
async def list_articles(rubrique: str = None, featured: bool = None):
    query = {}
    if rubrique: query["rubrique"] = rubrique
    if featured is not None: query["featured"] = featured
    docs = await articles_collection.find(query).sort("created_at", -1).to_list(100)
    return [serialize_doc(d) for d in docs]


@app.get("/api/articles/{article_id}", tags=["Articles"])
async def get_article(article_id: str):
    doc = await articles_collection.find_one({"_id": to_object_id(article_id)})
    if not doc:
        raise HTTPException(404, "Article introuvable.")
    return serialize_doc(doc)


@app.post("/api/articles", tags=["Articles"])
async def create_article(body: ArticleCreate, user: dict = Depends(require_admin)):
    doc = body.model_dump()
    doc["created_at"] = now()
    result = await articles_collection.insert_one(doc)
    return {"message": "Article publié.", "id": str(result.inserted_id)}


@app.delete("/api/articles/{article_id}", tags=["Articles"])
async def delete_article(article_id: str, user: dict = Depends(require_admin)):
    result = await articles_collection.delete_one({"_id": to_object_id(article_id)})
    if result.deleted_count == 0:
        raise HTTPException(404, "Article introuvable.")
    return {"message": "Article supprimé."}


# ══════════════════════════════════════════════════════════════════════════════
# QUESTIONS COMMUNAUTÉ
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/questions", tags=["Questions"])
async def list_questions():
    docs = await questions_collection.find().sort("created_at", -1).to_list(50)
    return [serialize_doc(d) for d in docs]


@app.post("/api/questions", tags=["Questions"])
async def create_question(body: QuestionCreate, user: dict = Depends(get_current_user)):
    doc = {
        "question":   body.question,
        "user_id":    to_object_id(body.user_id),
        "reponses":   [],
        "created_at": now(),
    }
    result = await questions_collection.insert_one(doc)
    return {"message": "Question posée.", "id": str(result.inserted_id)}


@app.post("/api/questions/{question_id}/reponses", tags=["Questions"])
async def add_reponse(question_id: str, body: ReponseCreate,
                      user: dict = Depends(get_current_user)):
    reponse = {
        "message":    body.message,
        "user_id":    to_object_id(body.user_id),
        "created_at": now(),
    }
    result = await questions_collection.update_one(
        {"_id": to_object_id(question_id)},
        {"$push": {"reponses": reponse}}
    )
    if result.matched_count == 0:
        raise HTTPException(404, "Question introuvable.")
    return {"message": "Réponse ajoutée."}


# ══════════════════════════════════════════════════════════════════════════════
# NOTIFICATIONS
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/notifications", tags=["Notifications"])
async def get_notifications(user: dict = Depends(get_current_user)):
    docs = await notifications_collection.find(
        {"user_id": to_object_id(user["sub"])}
    ).sort("created_at", -1).to_list(50)
    return [serialize_doc(d) for d in docs]


@app.patch("/api/notifications/{notif_id}/read", tags=["Notifications"])
async def mark_read(notif_id: str, user: dict = Depends(get_current_user)):
    await notifications_collection.update_one(
        {"_id": to_object_id(notif_id)}, {"$set": {"read": True}}
    )
    return {"message": "Notification marquée comme lue."}


@app.patch("/api/notifications/read-all", tags=["Notifications"])
async def mark_all_read(user: dict = Depends(get_current_user)):
    await notifications_collection.update_many(
        {"user_id": to_object_id(user["sub"]), "read": False},
        {"$set": {"read": True}}
    )
    return {"message": "Toutes les notifications marquées comme lues."}


# ══════════════════════════════════════════════════════════════════════════════
# ADMIN — Dashboard stats (Dashboard.tsx)
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/admin/stats", tags=["Admin"])
async def get_stats(user: dict = Depends(require_admin)):
    """Statistiques globales pour le tableau de bord admin."""
    oeuvres_count        = await oeuvres_collection.count_documents({})
    artistes_count       = await artistes_collection.count_documents({})
    collectionneurs_count = await users_collection.count_documents({"role": "collectionneur"})
    demandes_count       = await demandes_collection.count_documents({})
    en_attente_count     = await demandes_collection.count_documents({"statut": "en_attente"})

    # 5 dernières demandes avec infos user + oeuvre
    demandes_cursor = demandes_collection.find().sort("created_at", -1).limit(5)
    demandes_recentes = []
    async for d in demandes_cursor:
        user_doc   = await users_collection.find_one({"_id": d["user_id"]})
        oeuvre_doc = await oeuvres_collection.find_one({"_id": d["oeuvre_id"]})
        demandes_recentes.append({
            "id":     str(d["_id"]),
            "name":   user_doc["username"] if user_doc else "—",
            "oeuvre": oeuvre_doc["titre"]  if oeuvre_doc else "—",
            "prix":   d.get("prix_snapshot", 0),
            "date":   d["created_at"].strftime("%d/%m/%Y") if d.get("created_at") else "—",
            "status": d.get("statut", "en_attente").replace("en_attente", "pending")
                        .replace("acceptee", "approved").replace("refusee", "rejected"),
        })

    return {
        "oeuvres_count":         oeuvres_count,
        "artistes_count":        artistes_count,
        "collectionneurs_count": collectionneurs_count,
        "demandes_count":        demandes_count,
        "en_attente_count":      en_attente_count,
        "demandes_recentes":     demandes_recentes,
    }


# ══════════════════════════════════════════════════════════════════════════════
# ADMIN — Modération (Moderation.tsx)
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/admin/commentaires/signales", tags=["Admin"])
async def get_commentaires_signales(user: dict = Depends(require_admin)):
    """Commentaires ayant au moins 1 signalement, triés par nombre de signalements."""
    docs = await commentaires_collection.find(
        {"signalements": {"$gte": 1}}
    ).sort("signalements", -1).to_list(50)

    result = []
    for d in docs:
        user_doc   = await users_collection.find_one({"_id": d["user_id"]})
        oeuvre_doc = await oeuvres_collection.find_one({"_id": d["oeuvre_id"]})
        result.append({
            "id":          str(d["_id"]),
            "auteur":      user_doc["username"] if user_doc else "Inconnu",
            "userId":      str(d["user_id"]),
            "oeuvre":      oeuvre_doc["titre"] if oeuvre_doc else "—",
            "date":        d["created_at"].strftime("Il y a %d jours") if d.get("created_at") else "—",
            "message":     d["message"],
            "signalements": d.get("signalements", 0),
        })
    return result


@app.post("/api/admin/users/{user_id}/bannir", tags=["Admin"])
async def bannir_user(user_id: str, admin: dict = Depends(require_admin)):
    """Bannit un utilisateur."""
    result = await users_collection.update_one(
        {"_id": to_object_id(user_id)}, {"$set": {"is_banned": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(404, "Utilisateur introuvable.")
    return {"message": "Utilisateur banni."}


@app.post("/api/admin/users/{user_id}/debannir", tags=["Admin"])
async def debannir_user(user_id: str, admin: dict = Depends(require_admin)):
    result = await users_collection.update_one(
        {"_id": to_object_id(user_id)}, {"$set": {"is_banned": False}}
    )
    if result.matched_count == 0:
        raise HTTPException(404, "Utilisateur introuvable.")
    return {"message": "Utilisateur débanni."}


@app.get("/api/admin/users", tags=["Admin"])
async def list_users(role: str = None, is_banned: bool = None,
                     admin: dict = Depends(require_admin)):
    """Liste tous les utilisateurs avec filtres."""
    query = {}
    if role:     query["role"]     = role
    if is_banned is not None: query["is_banned"] = is_banned
    docs = await users_collection.find(query).sort("created_at", -1).to_list(200)
    # Ne jamais renvoyer les mots de passe
    return [{k: v for k, v in serialize_doc(d).items() if k != "password"} for d in docs]