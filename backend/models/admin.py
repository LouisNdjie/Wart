from pydantic import BaseModel, Field
from config.databaseGestion import db

#connexion à la collection admin
admin_collection = db.admin

#schéma de validation pour les admins
class Admin(BaseModel):
    name:str
    email:str
    password:str