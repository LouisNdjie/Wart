from pydantic import BaseModel, Field
from config.databaseGestion import db

#connexion à la collection oeuvres
oeuvres_collection = db.oeuvre

#schéma de validation pour les oeuvres
class Oeuvre(BaseModel):
    title:str
    description:str
    image_url:str
    artist_id:str