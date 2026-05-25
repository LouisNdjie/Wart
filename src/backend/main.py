from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

#importation des modeles
from models.collectionneur import collectionneur_collection,Collectionneur
from models.oeuvre import Oeuvre
from models.comment import Comment
from models.like import Like
from models.admin import Admin
from models.artistes import artistes_collection,Artiste

app = FastAPI()

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)


#definission des routes
@app.post("/api/artistes")
async def add_artiste(artiste: Artiste):
    artiste_dict = artiste.model_dump()
    result = await artistes_collection.insert_one(artiste_dict)
    return {"message": "Artiste ajouté avec succès", "id": str(result.inserted_id)}

@app.post("/api/collectionneurs")
async def add_collectionneur(collectionneur: Collectionneur):
    collectionneur_dict = collectionneur.model_dump()
    result = await collectionneur_collection.insert_one(collectionneur_dict)
    return {"message": "Collectionneur ajouté avec succès", "id": str(result.inserted_id)}