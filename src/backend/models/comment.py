from pydantic import BaseModel, Field
from config.databaseGestion import db

#connexion à la collection comment
comment_collection = db.comment

#schéma de validation pour les commentaires
class Comment(BaseModel):
    content:str
    oeuvre_id:str
    collector_id:str