from pydantic import BaseModel, Field
from config.databaseGestion import db

#connexion à la collection artistes
artistes_collection = db.artiste

#schéma de validation pour les artistes
class Artiste(BaseModel):
    name:str
    email:str
    password:str
    pseudo:str