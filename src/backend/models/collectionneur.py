from pydantic import BaseModel, Field
from config.databaseGestion import db

#connexion à la collection collectionneur
collectionneur_collection = db.collectionneur

#schéma de validation pour les collectionneur
class Collectionneur(BaseModel):
    name:str
    email:str
    password:str