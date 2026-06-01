from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utils.helpers import decode_token

bearer_scheme = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> dict:
    """Dependency : vérifie le token JWT et retourne le payload {sub, role}."""
    try:
        payload = decode_token(credentials.credentials)
        return payload
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide ou expiré",
        )

def require_admin(user: dict = Depends(get_current_user)) -> dict:
    """Dependency : autorise uniquement les admins."""
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Accès réservé aux administrateurs")
    return user

def require_artiste(user: dict = Depends(get_current_user)) -> dict:
    """Dependency : autorise artistes et admins."""
    if user.get("role") not in ("artiste", "admin"):
        raise HTTPException(status_code=403, detail="Accès réservé aux artistes")
    return user