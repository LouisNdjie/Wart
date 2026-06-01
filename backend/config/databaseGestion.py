from motor.motor_asyncio import AsyncIOMotorClient

MONGO_PORT = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_PORT)

# Connexion à la base de données
db = client.gallery