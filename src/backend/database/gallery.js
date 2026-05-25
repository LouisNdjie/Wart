/*
* Script Name: gallery.js
* Script de configuration et d'initialisation de la base de données
 */

//création de la base de données
const dbName = "gallery";
const database = db.getSiblingDB(dbName);

print(`------- Création de la base de données ${dbName} -------`);

//Nettoyage de la base de données
database.artiste.drop();
database.collectioneur.drop();
database.oeuvre.drop();
database.comment.drop();
database.like.drop();
database.admin.drop();

print(`------- Base de données ${dbName} nettoyée -------`);

//création des collections

//---------------------------------------------------artiste---------------------------------------------------
database.createCollection("artiste", 
    {
        validator:{
            $jsonSchema:{
                bsonType: "object",
                required: ["name", "email", "password", "pseudo"],
                properties: {
                    name: {
                        bsonType: "string",
                        description: "Le nom de l'artiste doit être une chaîne de caractères et est requis"
                    },
                    email: {
                        bsonType: "string",
                        description: "L'email de l'artiste doit être une chaîne de caractères et est requis"
                    },
                    password: {
                        bsonType: "string",
                        description: "Le mot de passe de l'artiste doit être une chaîne de caractères et est requis"
                    },
                    pseudo: {
                        bsonType: "string",
                        description: "Le pseudo de l'artiste doit être une chaîne de caractères et est requis"
                    }
                }
            }
        }
    });

//---------------------------------------------------collectioneur---------------------------------------------------
database.createCollection("collectioneur", {
    validator:{
        $jsonSchema:{
            bsonType: "object",
            required: ["name", "email", "password"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "Le nom du collectionneur doit être une chaîne de caractères et est requis"
                },
                email: {
                    bsonType: "string",
                    description: "L'email du collectionneur doit être une chaîne de caractères et est requis"
                },
                password: {
                    bsonType: "string",
                    description: "Le mot de passe du collectionneur doit être une chaîne de caractères et est requis"
                }
            }
        }
    }
});

//---------------------------------------------------oeuvre---------------------------------------------------
database.createCollection("oeuvre",{
    validator:{
        $jsonSchema:{
            bsonType: "object",
            required: ["title", "description", "image", "artistId"],
            properties: {
                title: {
                    bsonType: "string",
                    description: "Le titre de l'oeuvre doit être une chaîne de caractères et est requis"
                },
                description: {
                    bsonType: "string",
                    description: "La description de l'oeuvre doit être une chaîne de caractères et est requis"
                },
                image: {
                    bsonType: "string",
                    description: "L'image de l'oeuvre doit être une chaîne de caractères et est requis"
                },
                artistId: {
                    bsonType: "string",
                    description: "L'ID de l'artiste de l'oeuvre doit être une chaîne de caractères et est requis"
                }
            }
        }
    }
});

//---------------------------------------------------comment---------------------------------------------------
database.createCollection("comment",{
    validator:{
        $jsonSchema:{
            bsonType: "object",
            required: ["content", "artworkId", "collectorId"],
            properties: {
                content: {
                    bsonType: "string",
                    description: "Le contenu du commentaire doit être une chaîne de caractères et est requis"
                },
                artworkId: {
                    bsonType: "string",
                    description: "L'ID de l'oeuvre du commentaire doit être une chaîne de caractères et est requis"
                },
                collectorId: {
                    bsonType: "string",
                    description: "L'ID du collectionneur du commentaire doit être une chaîne de caractères et est requis"
                }
            }
        }
    }
});

//---------------------------------------------------like---------------------------------------------------
database.createCollection("like",{
    validator:{
        $jsonSchema:{
            bsonType: "object",
            required: ["artworkId", "collectorId"],
            properties: {
                artworkId: {
                    bsonType: "string",
                    description: "L'ID de l'oeuvre du like doit être une chaîne de caractères et est requis"
                },
                collectorId: {
                    bsonType: "string",
                    description: "L'ID du collectionneur du like doit être une chaîne de caractères et est requis"
                }
            }
        }
    }
});

//---------------------------------------------------admin---------------------------------------------------
database.createCollection("admin",{
    validator:{
        $jsonSchema:{
            bsonType: "object",
            required: ["name", "email", "password"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "Le nom de l'administrateur doit être une chaîne de caractères et est requis"
                },
                email: {
                    bsonType: "string",
                    description: "L'email de l'administrateur doit être une chaîne de caractères et est requis"
                },
                password: {
                    bsonType: "string",
                    description: "Le mot de passe de l'administrateur doit être une chaîne de caractères et est requis"
                }
            }
        }
    }
});

//ajout des deux administrateurs par défaut
database.admin.insertMany([
    {
        name: "Louis",
        email: "louisndjie@icloud.com",
        password: "password1"
    },
    {
        name: "Shane",
        email: "embollashane@gmail.com",
        password: "password2"
    }
]);

print(`------- Collections créées et administrateurs par défaut ajoutés -------`);
