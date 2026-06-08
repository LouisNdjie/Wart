"""
main.py — Point d'entrée du backend Wart
FastAPI + Motor (MongoDB async) + JWT
"""

from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from contextlib import asynccontextmanager
from typing import List, Optional
from datetime import datetime, timedelta
from bson import ObjectId
import motor.motor_asyncio
import bcrypt
import jwt
import os


# ============================================================================
# CONFIG
# ============================================================================
MONGO_URI    = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME      = os.getenv("DB_NAME", "wart")
JWT_SECRET   = os.getenv("JWT_SECRET", "changeme_in_production")
JWT_ALGO     = "HS256"
JWT_EXPIRE_H = 24

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db     = client[DB_NAME]

# Collections
users_col      = db["users"]
artistes_col   = db["artistes"]
oeuvres_col    = db["oeuvres"]
commentaires_col = db["commentaires"]
demandes_col   = db["demandes"]
expositions_col = db["expositions"]
articles_col   = db["articles"]
questions_col  = db["questions"]
notifs_col     = db["notifications"]


# ============================================================================
# LIFESPAN (connexion / déconnexion MongoDB)
# ============================================================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("✅ Connexion MongoDB établie")
    yield
    client.close()
    print("🔴 Connexion MongoDB fermée")


# ============================================================================
# APP
# ============================================================================
app = FastAPI(
    title="Wart API",
    description="Backend de la galerie d'art Wart",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],   # URL du frontend React (Vite)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# AUTH UTILS
# ============================================================================
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def create_token(user_id: str, role: str) -> str:
    payload = {
        "sub":  user_id,
        "role": role,
        "exp":  datetime.utcnow() + timedelta(hours=JWT_EXPIRE_H),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """Décode le JWT et retourne le document user depuis MongoDB."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
        user_id = payload.get("sub")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token expiré")
    except jwt.InvalidTokenError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token invalide")

    user = await users_col.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Utilisateur introuvable")
    if user.get("is_banned"):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Compte banni")
    return user


def require_role(*roles: str):
    """Dépendance : vérifie que l'utilisateur connecté a l'un des rôles attendus."""
    async def checker(current_user: dict = Depends(get_current_user)):
        if current_user["role"] not in roles:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès refusé")
        return current_user
    return checker


def to_str_id(doc: dict) -> dict:
    """Convertit _id ObjectId en str pour la sérialisation JSON."""
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


def oid(val: str) -> ObjectId:
    """Convertit un str en ObjectId ou lève une 400."""
    if not ObjectId.is_valid(val):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"ID invalide : {val}")
    return ObjectId(val)


# ============================================================================
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ROUTER : AUTH   /auth
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ============================================================================
from fastapi import APIRouter
from pydantic import BaseModel, EmailStr

auth_router = APIRouter(prefix="/auth", tags=["Auth"])

class RegisterBody(BaseModel):
    username: str
    email:    EmailStr
    password: str
    role:     str   # "artiste" | "collectionneur"

class LoginBody(BaseModel):
    email:    EmailStr
    password: str


@auth_router.post("/register", status_code=201)
async def register(body: RegisterBody):
    """Inscription d'un nouvel utilisateur (artiste ou collectionneur)."""
    if body.role not in ("artiste", "collectionneur"):
        raise HTTPException(400, "Rôle invalide")
    if await users_col.find_one({"email": body.email}):
        raise HTTPException(409, "Email déjà utilisé")
    if await users_col.find_one({"username": body.username}):
        raise HTTPException(409, "Nom d'utilisateur déjà pris")

    doc = {
        "username":   body.username,
        "email":      body.email,
        "password":   hash_password(body.password),
        "role":       body.role,
        "is_banned":  False,
        "created_at": datetime.utcnow(),
    }
    result = await users_col.insert_one(doc)
    return {"message": "Compte créé", "user_id": str(result.inserted_id)}


@auth_router.post("/login")
async def login(body: LoginBody):
    """Connexion — retourne un JWT."""
    user = await users_col.find_one({"email": body.email})
    if not user or not verify_password(body.password, user["password"]):
        raise HTTPException(401, "Identifiants incorrects")
    if user.get("is_banned"):
        raise HTTPException(403, "Compte banni")

    token = create_token(str(user["_id"]), user["role"])
    return {"access_token": token, "token_type": "bearer", "role": user["role"]}


@auth_router.get("/me")
async def me(current_user: dict = Depends(get_current_user)):
    """Retourne le profil de l'utilisateur connecté."""
    current_user.pop("password", None)
    return to_str_id(current_user)


@auth_router.put("/me")
async def update_me(
    body: dict,
    current_user: dict = Depends(get_current_user),
):
    """Mise à jour du profil (avatar, username)."""
    allowed = {k: v for k, v in body.items() if k in ("username", "avatar")}
    if not allowed:
        raise HTTPException(400, "Aucun champ modifiable fourni")
    await users_col.update_one({"_id": current_user["_id"]}, {"$set": allowed})
    return {"message": "Profil mis à jour"}


@auth_router.put("/me/password")
async def change_password(
    body: dict,
    current_user: dict = Depends(get_current_user),
):
    """Changement de mot de passe."""
    old, new = body.get("old_password"), body.get("new_password")
    if not old or not new:
        raise HTTPException(400, "old_password et new_password requis")
    if not verify_password(old, current_user["password"]):
        raise HTTPException(401, "Ancien mot de passe incorrect")
    await users_col.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"password": hash_password(new)}},
    )
    return {"message": "Mot de passe mis à jour"}


# ============================================================================
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ROUTER : ARTISTES   /artistes
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ============================================================================
artistes_router = APIRouter(prefix="/artistes", tags=["Artistes"])


@artistes_router.get("/")
async def list_artistes(
    tag: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = Query(20, le=100),
):
    """Liste publique des artistes (filtrable par tag ou recherche texte)."""
    query = {}
    if tag:
        query["tag"] = tag
    if search:
        query["$text"] = {"$search": search}

    cursor = artistes_col.find(query).skip(skip).limit(limit)
    docs = [to_str_id(d) async for d in cursor]
    return docs


@artistes_router.get("/{artiste_id}")
async def get_artiste(artiste_id: str):
    """Profil public d'un artiste."""
    doc = await artistes_col.find_one({"_id": oid(artiste_id)})
    if not doc:
        raise HTTPException(404, "Artiste introuvable")
    return to_str_id(doc)


@artistes_router.post("/", status_code=201)
async def create_artiste_profile(
    body: dict,
    current_user: dict = Depends(require_role("artiste")),
):
    """Création du profil artiste (une seule fois par compte)."""
    if await artistes_col.find_one({"user_id": current_user["_id"]}):
        raise HTTPException(409, "Profil artiste déjà créé")
    body["user_id"]    = current_user["_id"]
    body["created_at"] = datetime.utcnow()
    result = await artistes_col.insert_one(body)
    return {"artiste_id": str(result.inserted_id)}


@artistes_router.put("/me")
async def update_artiste_profile(
    body: dict,
    current_user: dict = Depends(require_role("artiste")),
):
    """Mise à jour du profil artiste."""
    allowed_fields = ("artistName", "artistHandle", "tag", "artistProfile",
                      "artistAvatar", "artistPaints")
    update = {k: v for k, v in body.items() if k in allowed_fields}
    await artistes_col.update_one(
        {"user_id": current_user["_id"]}, {"$set": update}
    )
    return {"message": "Profil mis à jour"}


@artistes_router.get("/{artiste_id}/oeuvres")
async def get_oeuvres_by_artiste(artiste_id: str, skip: int = 0, limit: int = 20):
    """Toutes les œuvres d'un artiste donné."""
    cursor = oeuvres_col.find({"artiste_id": oid(artiste_id)}).skip(skip).limit(limit)
    return [to_str_id(d) async for d in cursor]


# ============================================================================
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ROUTER : OEUVRES   /oeuvres
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ============================================================================
oeuvres_router = APIRouter(prefix="/oeuvres", tags=["Oeuvres"])


@oeuvres_router.get("/")
async def list_oeuvres(
    tag:    Optional[str] = None,
    statut: Optional[str] = None,
    search: Optional[str] = None,
    prix_min: Optional[float] = None,
    prix_max: Optional[float] = None,
    skip:  int = 0,
    limit: int = Query(20, le=100),
):
    """Catalogue public des œuvres avec filtres."""
    query: dict = {}
    if tag:    query["tag"]    = tag
    if statut: query["statut"] = statut
    if search: query["$text"]  = {"$search": search}
    if prix_min is not None or prix_max is not None:
        query["prix"] = {}
        if prix_min is not None: query["prix"]["$gte"] = prix_min
        if prix_max is not None: query["prix"]["$lte"] = prix_max

    cursor = oeuvres_col.find(query).sort("created_at", -1).skip(skip).limit(limit)
    return [to_str_id(d) async for d in cursor]


@oeuvres_router.get("/{oeuvre_id}")
async def get_oeuvre(oeuvre_id: str):
    """Détail d'une œuvre."""
    doc = await oeuvres_col.find_one({"_id": oid(oeuvre_id)})
    if not doc:
        raise HTTPException(404, "Œuvre introuvable")
    return to_str_id(doc)


@oeuvres_router.post("/", status_code=201)
async def create_oeuvre(
    body: dict,
    current_user: dict = Depends(require_role("artiste")),
):
    """Publier une nouvelle œuvre."""
    artiste = await artistes_col.find_one({"user_id": current_user["_id"]})
    if not artiste:
        raise HTTPException(400, "Créez d'abord votre profil artiste")
    body["artiste_id"] = artiste["_id"]
    body["likes"]      = 0
    body["likedBy"]    = []
    body["statut"]     = body.get("statut", "Disponible")
    body["created_at"] = datetime.utcnow()
    result = await oeuvres_col.insert_one(body)
    return {"oeuvre_id": str(result.inserted_id)}


@oeuvres_router.put("/{oeuvre_id}")
async def update_oeuvre(
    oeuvre_id: str,
    body: dict,
    current_user: dict = Depends(require_role("artiste")),
):
    """Modifier une œuvre (propriétaire uniquement)."""
    oeuvre = await oeuvres_col.find_one({"_id": oid(oeuvre_id)})
    if not oeuvre:
        raise HTTPException(404, "Œuvre introuvable")
    artiste = await artistes_col.find_one({"user_id": current_user["_id"]})
    if not artiste or oeuvre["artiste_id"] != artiste["_id"]:
        raise HTTPException(403, "Non autorisé")

    allowed = ("titre", "medium", "annee", "dimensions", "description",
               "prix", "statut", "tag", "imageUrl")
    update = {k: v for k, v in body.items() if k in allowed}
    await oeuvres_col.update_one({"_id": oid(oeuvre_id)}, {"$set": update})
    return {"message": "Œuvre mise à jour"}


@oeuvres_router.delete("/{oeuvre_id}", status_code=204)
async def delete_oeuvre(
    oeuvre_id: str,
    current_user: dict = Depends(require_role("artiste")),
):
    """Supprimer une œuvre (propriétaire uniquement)."""
    oeuvre = await oeuvres_col.find_one({"_id": oid(oeuvre_id)})
    if not oeuvre:
        raise HTTPException(404, "Œuvre introuvable")
    artiste = await artistes_col.find_one({"user_id": current_user["_id"]})
    if not artiste or oeuvre["artiste_id"] != artiste["_id"]:
        raise HTTPException(403, "Non autorisé")
    await oeuvres_col.delete_one({"_id": oid(oeuvre_id)})


@oeuvres_router.post("/{oeuvre_id}/like")
async def toggle_like(
    oeuvre_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Like / Unlike une œuvre (toggle)."""
    oeuvre = await oeuvres_col.find_one({"_id": oid(oeuvre_id)})
    if not oeuvre:
        raise HTTPException(404, "Œuvre introuvable")

    user_oid = current_user["_id"]
    already_liked = user_oid in oeuvre.get("likedBy", [])

    if already_liked:
        await oeuvres_col.update_one(
            {"_id": oid(oeuvre_id)},
            {"$pull": {"likedBy": user_oid}, "$inc": {"likes": -1}},
        )
        return {"liked": False, "likes": oeuvre["likes"] - 1}
    else:
        await oeuvres_col.update_one(
            {"_id": oid(oeuvre_id)},
            {"$addToSet": {"likedBy": user_oid}, "$inc": {"likes": 1}},
        )
        return {"liked": True, "likes": oeuvre["likes"] + 1}


# ============================================================================
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ROUTER : COMMENTAIRES   /commentaires
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ============================================================================
comments_router = APIRouter(prefix="/commentaires", tags=["Commentaires"])


@comments_router.get("/oeuvre/{oeuvre_id}")
async def get_comments(oeuvre_id: str, skip: int = 0, limit: int = 50):
    """Commentaires d'une œuvre."""
    cursor = commentaires_col.find(
        {"oeuvre_id": oid(oeuvre_id)}
    ).sort("created_at", -1).skip(skip).limit(limit)
    return [to_str_id(d) async for d in cursor]


@comments_router.post("/", status_code=201)
async def post_comment(
    body: dict,
    current_user: dict = Depends(get_current_user),
):
    """Poster un commentaire sur une œuvre."""
    oeuvre_id = body.get("oeuvre_id")
    message   = body.get("message", "").strip()
    if not oeuvre_id or not message:
        raise HTTPException(400, "oeuvre_id et message requis")
    if not await oeuvres_col.find_one({"_id": oid(oeuvre_id)}):
        raise HTTPException(404, "Œuvre introuvable")

    doc = {
        "message":      message,
        "oeuvre_id":    oid(oeuvre_id),
        "user_id":      current_user["_id"],
        "signalements": 0,
        "signale_par":  [],
        "created_at":   datetime.utcnow(),
    }
    result = await commentaires_col.insert_one(doc)
    return {"commentaire_id": str(result.inserted_id)}


@comments_router.delete("/{commentaire_id}", status_code=204)
async def delete_comment(
    commentaire_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Supprimer son propre commentaire."""
    comment = await commentaires_col.find_one({"_id": oid(commentaire_id)})
    if not comment:
        raise HTTPException(404, "Commentaire introuvable")
    if comment["user_id"] != current_user["_id"] and current_user["role"] != "admin":
        raise HTTPException(403, "Non autorisé")
    await commentaires_col.delete_one({"_id": oid(commentaire_id)})


@comments_router.post("/{commentaire_id}/signaler")
async def signaler_comment(
    commentaire_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Signaler un commentaire."""
    comment = await commentaires_col.find_one({"_id": oid(commentaire_id)})
    if not comment:
        raise HTTPException(404, "Commentaire introuvable")
    user_oid = current_user["_id"]
    if user_oid in comment.get("signale_par", []):
        raise HTTPException(409, "Déjà signalé")

    await commentaires_col.update_one(
        {"_id": oid(commentaire_id)},
        {"$addToSet": {"signale_par": user_oid}, "$inc": {"signalements": 1}},
    )
    return {"message": "Signalement enregistré", "signalements": comment["signalements"] + 1}


# ============================================================================
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ROUTER : DEMANDES D'ACHAT   /demandes
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ============================================================================
demandes_router = APIRouter(prefix="/demandes", tags=["Demandes"])


@demandes_router.post("/", status_code=201)
async def create_demande(
    body: dict,
    current_user: dict = Depends(require_role("collectionneur")),
):
    """Faire une demande d'achat sur une œuvre disponible."""
    oeuvre_id = body.get("oeuvre_id")
    if not oeuvre_id:
        raise HTTPException(400, "oeuvre_id requis")

    oeuvre = await oeuvres_col.find_one({"_id": oid(oeuvre_id)})
    if not oeuvre:
        raise HTTPException(404, "Œuvre introuvable")
    if oeuvre["statut"] != "Disponible":
        raise HTTPException(409, "Œuvre non disponible")

    # Index unique partiel : un seul en_attente par (user, oeuvre)
    existing = await demandes_col.find_one({
        "user_id":  current_user["_id"],
        "oeuvre_id": oid(oeuvre_id),
        "statut":    "en_attente",
    })
    if existing:
        raise HTTPException(409, "Demande déjà en cours pour cette œuvre")

    doc = {
        "oeuvre_id":     oid(oeuvre_id),
        "user_id":       current_user["_id"],
        "statut":        "en_attente",
        "message":       body.get("message", ""),
        "prix_snapshot": oeuvre["prix"],
        "created_at":    datetime.utcnow(),
    }
    result = await demandes_col.insert_one(doc)

    # Marquer l'œuvre comme Réservée
    await oeuvres_col.update_one(
        {"_id": oid(oeuvre_id)}, {"$set": {"statut": "Réservée"}}
    )
    return {"demande_id": str(result.inserted_id)}


@demandes_router.get("/mes-demandes")
async def mes_demandes(
    current_user: dict = Depends(require_role("collectionneur")),
):
    """Toutes les demandes du collectionneur connecté."""
    cursor = demandes_col.find({"user_id": current_user["_id"]}).sort("created_at", -1)
    return [to_str_id(d) async for d in cursor]


@demandes_router.get("/recues")
async def demandes_recues(
    current_user: dict = Depends(require_role("artiste")),
):
    """Demandes reçues sur les œuvres de l'artiste connecté."""
    artiste = await artistes_col.find_one({"user_id": current_user["_id"]})
    if not artiste:
        raise HTTPException(404, "Profil artiste introuvable")

    # Récupère les _id des oeuvres de cet artiste
    oeuvres_ids = [
        o["_id"] async for o in oeuvres_col.find(
            {"artiste_id": artiste["_id"]}, {"_id": 1}
        )
    ]
    cursor = demandes_col.find(
        {"oeuvre_id": {"$in": oeuvres_ids}}
    ).sort("created_at", -1)
    return [to_str_id(d) async for d in cursor]


@demandes_router.put("/{demande_id}/repondre")
async def repondre_demande(
    demande_id: str,
    body: dict,
    current_user: dict = Depends(require_role("artiste")),
):
    """Accepter ou refuser une demande d'achat."""
    nouveau_statut = body.get("statut")
    if nouveau_statut not in ("acceptee", "refusee"):
        raise HTTPException(400, "statut doit être 'acceptee' ou 'refusee'")

    demande = await demandes_col.find_one({"_id": oid(demande_id)})
    if not demande:
        raise HTTPException(404, "Demande introuvable")
    if demande["statut"] != "en_attente":
        raise HTTPException(409, "Demande déjà traitée")

    # Vérifier que l'œuvre appartient à l'artiste connecté
    artiste = await artistes_col.find_one({"user_id": current_user["_id"]})
    oeuvre  = await oeuvres_col.find_one({"_id": demande["oeuvre_id"]})
    if not artiste or oeuvre["artiste_id"] != artiste["_id"]:
        raise HTTPException(403, "Non autorisé")

    await demandes_col.update_one(
        {"_id": oid(demande_id)}, {"$set": {"statut": nouveau_statut}}
    )

    # Mettre à jour le statut de l'œuvre
    oeuvre_statut = "Vendue" if nouveau_statut == "acceptee" else "Disponible"
    await oeuvres_col.update_one(
        {"_id": demande["oeuvre_id"]}, {"$set": {"statut": oeuvre_statut}}
    )

    # Notifier le collectionneur
    await notifs_col.insert_one({
        "user_id":    demande["user_id"],
        "type":       "achat",
        "message":    f"Votre demande a été {'acceptée' if nouveau_statut == 'acceptee' else 'refusée'}.",
        "read":       False,
        "ref_id":     demande["oeuvre_id"],
        "ref_type":   "oeuvre",
        "created_at": datetime.utcnow(),
    })
    return {"message": f"Demande {nouveau_statut}"}


# ============================================================================
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ROUTER : EXPOSITIONS   /expositions
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ============================================================================
expositions_router = APIRouter(prefix="/expositions", tags=["Expositions"])


@expositions_router.get("/")
async def list_expositions(
    statut: Optional[str] = None,
    skip: int = 0, limit: int = 20,
):
    query = {}
    if statut: query["statut"] = statut
    cursor = expositions_col.find(query).sort("created_at", -1).skip(skip).limit(limit)
    return [to_str_id(d) async for d in cursor]


@expositions_router.get("/{expo_id}")
async def get_exposition(expo_id: str):
    doc = await expositions_col.find_one({"_id": oid(expo_id)})
    if not doc:
        raise HTTPException(404, "Exposition introuvable")
    # Incrémenter le compteur de vues
    await expositions_col.update_one({"_id": oid(expo_id)}, {"$inc": {"views": 1}})
    return to_str_id(doc)


@expositions_router.post("/", status_code=201)
async def create_exposition(
    body: dict,
    current_user: dict = Depends(require_role("admin")),
):
    """Créer une exposition (admin uniquement)."""
    body["statut"]     = body.get("statut", "en_cours")
    body["views"]      = 0
    body["likes"]      = 0
    body["created_at"] = datetime.utcnow()
    result = await expositions_col.insert_one(body)
    return {"expo_id": str(result.inserted_id)}


@expositions_router.put("/{expo_id}")
async def update_exposition(
    expo_id: str,
    body: dict,
    current_user: dict = Depends(require_role("admin")),
):
    allowed = ("title", "description", "dates", "tag", "imageUrl", "statut")
    update = {k: v for k, v in body.items() if k in allowed}
    await expositions_col.update_one({"_id": oid(expo_id)}, {"$set": update})
    return {"message": "Exposition mise à jour"}


@expositions_router.delete("/{expo_id}", status_code=204)
async def delete_exposition(
    expo_id: str,
    current_user: dict = Depends(require_role("admin")),
):
    await expositions_col.delete_one({"_id": oid(expo_id)})


# ============================================================================
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ROUTER : ARTICLES   /articles
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ============================================================================
articles_router = APIRouter(prefix="/articles", tags=["Articles"])


@articles_router.get("/")
async def list_articles(
    rubrique: Optional[str] = None,
    featured: Optional[bool] = None,
    search:   Optional[str] = None,
    skip: int = 0, limit: int = 20,
):
    query: dict = {}
    if rubrique: query["rubrique"] = rubrique
    if featured is not None: query["featured"] = featured
    if search: query["$text"] = {"$search": search}
    cursor = articles_col.find(query).sort("created_at", -1).skip(skip).limit(limit)
    return [to_str_id(d) async for d in cursor]


@articles_router.get("/{article_id}")
async def get_article(article_id: str):
    doc = await articles_col.find_one({"_id": oid(article_id)})
    if not doc:
        raise HTTPException(404, "Article introuvable")
    return to_str_id(doc)


@articles_router.post("/", status_code=201)
async def create_article(
    body: dict,
    current_user: dict = Depends(require_role("admin")),
):
    body["created_at"] = datetime.utcnow()
    result = await articles_col.insert_one(body)
    return {"article_id": str(result.inserted_id)}


@articles_router.put("/{article_id}")
async def update_article(
    article_id: str,
    body: dict,
    current_user: dict = Depends(require_role("admin")),
):
    allowed = ("titre", "excerpt", "contenu", "rubrique", "imageColor",
               "imageUrl", "readTime", "featured", "author")
    update = {k: v for k, v in body.items() if k in allowed}
    await articles_col.update_one({"_id": oid(article_id)}, {"$set": update})
    return {"message": "Article mis à jour"}


@articles_router.delete("/{article_id}", status_code=204)
async def delete_article(
    article_id: str,
    current_user: dict = Depends(require_role("admin")),
):
    await articles_col.delete_one({"_id": oid(article_id)})


# ============================================================================
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ROUTER : QUESTIONS   /questions
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ============================================================================
questions_router = APIRouter(prefix="/questions", tags=["Questions"])


@questions_router.get("/")
async def list_questions(skip: int = 0, limit: int = 20):
    cursor = questions_col.find().sort("created_at", -1).skip(skip).limit(limit)
    return [to_str_id(d) async for d in cursor]


@questions_router.get("/{question_id}")
async def get_question(question_id: str):
    doc = await questions_col.find_one({"_id": oid(question_id)})
    if not doc:
        raise HTTPException(404, "Question introuvable")
    return to_str_id(doc)


@questions_router.post("/", status_code=201)
async def post_question(
    body: dict,
    current_user: dict = Depends(get_current_user),
):
    question = body.get("question", "").strip()
    if not question:
        raise HTTPException(400, "Le champ question est requis")
    doc = {
        "question":   question,
        "user_id":    current_user["_id"],
        "reponses":   [],
        "created_at": datetime.utcnow(),
    }
    result = await questions_col.insert_one(doc)
    return {"question_id": str(result.inserted_id)}


@questions_router.post("/{question_id}/repondre", status_code=201)
async def repondre_question(
    question_id: str,
    body: dict,
    current_user: dict = Depends(get_current_user),
):
    """Ajouter une réponse embarquée dans le document question."""
    message = body.get("message", "").strip()
    if not message:
        raise HTTPException(400, "Le champ message est requis")
    if not await questions_col.find_one({"_id": oid(question_id)}):
        raise HTTPException(404, "Question introuvable")

    reponse = {
        "message":    message,
        "user_id":    current_user["_id"],
        "created_at": datetime.utcnow(),
    }
    await questions_col.update_one(
        {"_id": oid(question_id)},
        {"$push": {"reponses": reponse}},
    )
    return {"message": "Réponse ajoutée"}


@questions_router.delete("/{question_id}", status_code=204)
async def delete_question(
    question_id: str,
    current_user: dict = Depends(get_current_user),
):
    question = await questions_col.find_one({"_id": oid(question_id)})
    if not question:
        raise HTTPException(404, "Question introuvable")
    if question["user_id"] != current_user["_id"] and current_user["role"] != "admin":
        raise HTTPException(403, "Non autorisé")
    await questions_col.delete_one({"_id": oid(question_id)})


# ============================================================================
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ROUTER : NOTIFICATIONS   /notifications
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ============================================================================
notifs_router = APIRouter(prefix="/notifications", tags=["Notifications"])


@notifs_router.get("/")
async def mes_notifications(
    unread_only: bool = False,
    current_user: dict = Depends(get_current_user),
):
    """Notifications de l'utilisateur connecté."""
    query: dict = {"user_id": current_user["_id"]}
    if unread_only:
        query["read"] = False
    cursor = notifs_col.find(query).sort("created_at", -1).limit(50)
    return [to_str_id(d) async for d in cursor]


@notifs_router.put("/{notif_id}/lire")
async def mark_as_read(
    notif_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Marquer une notification comme lue."""
    notif = await notifs_col.find_one({"_id": oid(notif_id)})
    if not notif:
        raise HTTPException(404, "Notification introuvable")
    if notif["user_id"] != current_user["_id"]:
        raise HTTPException(403, "Non autorisé")
    await notifs_col.update_one({"_id": oid(notif_id)}, {"$set": {"read": True}})
    return {"message": "Notification marquée comme lue"}


@notifs_router.put("/lire-tout")
async def mark_all_read(
    current_user: dict = Depends(get_current_user),
):
    """Marquer toutes les notifications comme lues."""
    await notifs_col.update_many(
        {"user_id": current_user["_id"], "read": False},
        {"$set": {"read": True}},
    )
    return {"message": "Toutes les notifications marquées comme lues"}


# ============================================================================
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ROUTER : ADMIN   /admin
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ============================================================================
admin_router = APIRouter(prefix="/admin", tags=["Admin"])
is_admin = require_role("admin")


@admin_router.get("/stats")
async def dashboard_stats(current_user: dict = Depends(is_admin)):
    """Statistiques globales pour le dashboard admin."""
    return {
        "total_users":              await users_col.count_documents({}),
        "total_artistes":           await artistes_col.count_documents({}),
        "total_oeuvres":            await oeuvres_col.count_documents({}),
        "total_demandes":           await demandes_col.count_documents({}),
        "demandes_en_attente":      await demandes_col.count_documents({"statut": "en_attente"}),
        "total_commentaires":       await commentaires_col.count_documents({}),
        "commentaires_signales":    await commentaires_col.count_documents({"signalements": {"$gte": 1}}),
        "total_expositions":        await expositions_col.count_documents({}),
        "total_articles":           await articles_col.count_documents({}),
    }


@admin_router.get("/users")
async def list_users(
    skip: int = 0, limit: int = 50,
    current_user: dict = Depends(is_admin),
):
    """Liste de tous les utilisateurs."""
    cursor = users_col.find({}, {"password": 0}).skip(skip).limit(limit)
    return [to_str_id(d) async for d in cursor]


@admin_router.put("/users/{user_id}/ban")
async def ban_user(
    user_id: str,
    body: dict,
    current_user: dict = Depends(is_admin),
):
    """Bannir ou débannir un utilisateur."""
    is_banned = body.get("is_banned")
    if is_banned is None:
        raise HTTPException(400, "Champ is_banned requis")
    await users_col.update_one(
        {"_id": oid(user_id)}, {"$set": {"is_banned": is_banned}}
    )
    action = "banni" if is_banned else "débanni"
    return {"message": f"Utilisateur {action}"}


@admin_router.delete("/users/{user_id}", status_code=204)
async def delete_user(
    user_id: str,
    current_user: dict = Depends(is_admin),
):
    """Supprimer définitivement un compte utilisateur."""
    await users_col.delete_one({"_id": oid(user_id)})


@admin_router.get("/commentaires/signales")
async def commentaires_signales(
    seuil: int = Query(1, ge=1),
    current_user: dict = Depends(is_admin),
):
    """Commentaires avec au moins `seuil` signalements."""
    cursor = commentaires_col.find(
        {"signalements": {"$gte": seuil}}
    ).sort("signalements", -1)
    return [to_str_id(d) async for d in cursor]


@admin_router.delete("/commentaires/{commentaire_id}", status_code=204)
async def admin_delete_comment(
    commentaire_id: str,
    current_user: dict = Depends(is_admin),
):
    """Supprimer un commentaire signalé (modération)."""
    await commentaires_col.delete_one({"_id": oid(commentaire_id)})


# ============================================================================
# ENREGISTREMENT DES ROUTERS
# ============================================================================
app.include_router(auth_router)
app.include_router(artistes_router)
app.include_router(oeuvres_router)
app.include_router(comments_router)
app.include_router(demandes_router)
app.include_router(expositions_router)
app.include_router(articles_router)
app.include_router(questions_router)
app.include_router(notifs_router)
app.include_router(admin_router)


# ============================================================================
# HEALTH CHECK
# ============================================================================
@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "app": "Wart API", "version": "1.0.0"}