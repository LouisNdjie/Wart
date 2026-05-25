from motor.motor_asyncio import AsyncIOMotorClient

MONGO_PORT = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_PORT)

#connexion à la base de donnée 
db = client.gallery