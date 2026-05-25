from pydantic import BaseModel, Field
from config.databaseGestion import db

#connexion à la collection likes
like_collection = db.like

#schéma de validation pour les likes
class Like(BaseModel):
    oeuvre_id:str
    collector_id:str