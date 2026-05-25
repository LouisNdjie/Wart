// mongosh db.js

//Voici la base de donnée que j'ai faite
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "password", "role", "created_at"],
      properties: {
        username:   { bsonType: "string", description: "Nom d'utilisateur" },
        email:      { bsonType: "string", description: "Email unique" },
        password:   { bsonType: "string", description: "Hash bcrypt" },
        role:       { enum: ["artiste", "collectionneur", "admin"] },
        avatar:     { bsonType: "string" },
        is_banned:  { bsonType: "bool" },
        created_at: { bsonType: "date" },
      }
    }
  }
})


// ARTISTES
db.createCollection("artistes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["artistName", "artistHandle", "tag", "artistProfile", "user_id"],
      properties: {
        artistName:    { bsonType: "string" },
        artistHandle:  { bsonType: "string" },
        tag:           { bsonType: "string" },
        artistProfile: { bsonType: "string" },
        artistAvatar:  { bsonType: "string" },
        artistPaints:  { bsonType: "array", items: { bsonType: "string" } },
        user_id:       { bsonType: "objectId", description: "Lien vers users._id" },
        created_at:    { bsonType: "date" },
      }
    }
  }
})


// OEUVRES
db.createCollection("oeuvres", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["titre", "medium", "prix", "statut", "artiste_id", "tag", "created_at"],
      properties: {
        titre:       { bsonType: "string" },
        medium:      { bsonType: "string" },
        annee:       { bsonType: "int" },
        dimensions:  { bsonType: "string" },
        description: { bsonType: "string" },
        prix:        { bsonType: "double" },
        statut:      { enum: ["Disponible", "Réservée", "Vendue"] },
        tag:         { bsonType: "string" },
        imageUrl:    { bsonType: "string" },
        likes:       { bsonType: "int" },
        likedBy:     { bsonType: "array", items: { bsonType: "objectId" } },
        artiste_id:  { bsonType: "objectId" },
        created_at:  { bsonType: "date" },
      }
    }
  }
})

// COMMENTAIRES
db.createCollection("commentaires", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["message", "oeuvre_id", "user_id", "created_at"],
      properties: {
        message:    { bsonType: "string" },
        oeuvre_id:  { bsonType: "objectId" },
        user_id:    { bsonType: "objectId" },
        signalements: { bsonType: "int" },
        signale_par:  { bsonType: "array", items: { bsonType: "objectId" } },
        created_at:   { bsonType: "date" },
      }
    }
  }
})

// DEMANDES D'ACHAT
db.createCollection("demandes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["oeuvre_id", "user_id", "statut", "created_at"],
      properties: {
        oeuvre_id:    { bsonType: "objectId" },
        user_id:      { bsonType: "objectId" },
        statut:       { enum: ["en_attente", "acceptee", "refusee"] },
        message:      { bsonType: "string" },
        prix_snapshot: { bsonType: "double" },
        created_at:   { bsonType: "date" },
      }
    }
  }
})

// EXPOSITIONS
db.createCollection("expositions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "dates", "tag", "statut", "created_at"],
      properties: {
        title:       { bsonType: "string" },
        description: { bsonType: "string" },
        dates:       { bsonType: "string" },
        tag:         { bsonType: "string" },
        imageUrl:    { bsonType: "string" },
        statut:      { enum: ["en_cours", "archive"] },
        artiste_id:  { bsonType: "objectId" },
        views:       { bsonType: "int" },
        likes:       { bsonType: "int" },
        created_at:  { bsonType: "date" },
      }
    }
  }
})

// ARTICLES
db.createCollection("articles", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["titre", "rubrique", "author", "created_at"],
      properties: {
        titre:       { bsonType: "string" },
        excerpt:     { bsonType: "string" },
        contenu:     { bsonType: "string" },
        rubrique:    {
          enum: ["Dans l'Atelier", "Le Manifeste", "Zoom sur...", "La Minute Curieuse", "Questions"]
        },
        author:      { bsonType: "string" },
        imageColor:  { bsonType: "string" },
        imageUrl:    { bsonType: "string" },
        readTime:    { bsonType: "int" },
        featured:    { bsonType: "bool" },
        created_at:  { bsonType: "date" },
      }
    }
  }
})

// QUESTIONS
db.createCollection("questions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["question", "user_id", "created_at"],
      properties: {
        question:   { bsonType: "string" },
        user_id:    { bsonType: "objectId" },
        reponses:   {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["message", "user_id", "created_at"],
            properties: {
              message:    { bsonType: "string" },
              user_id:    { bsonType: "objectId" },
              created_at: { bsonType: "date" },
            }
          }
        },
        created_at: { bsonType: "date" },
      }
    }
  }
})

// NOTIFICATIONS
db.createCollection("notifications", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "type", "message", "read", "created_at"],
      properties: {
        user_id:    { bsonType: "objectId" },
        type:       { enum: ["info", "achat", "question", "news"] },
        message:    { bsonType: "string" },
        read:       { bsonType: "bool" },
        ref_id:     { bsonType: "objectId" },
        ref_type:   { enum: ["oeuvre", "demande", "question", "article"] },
        created_at: { bsonType: "date" },
      }
    }
  }
})

// Index

// users
db.users.createIndex({ email: 1 },    { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })
db.users.createIndex({ role: 1 })

// artistes
db.artistes.createIndex({ user_id: 1 }, { unique: true })
db.artistes.createIndex({ tag: 1 })
db.artistes.createIndex({ artistName: "text", artistProfile: "text" })

// oeuvres
db.oeuvres.createIndex({ artiste_id: 1 })
db.oeuvres.createIndex({ statut: 1 })
db.oeuvres.createIndex({ tag: 1 })
db.oeuvres.createIndex({ prix: 1 })
db.oeuvres.createIndex({ created_at: -1 })
db.oeuvres.createIndex({ titre: "text", description: "text", medium: "text" })

// commentaires
db.commentaires.createIndex({ oeuvre_id: 1 })
db.commentaires.createIndex({ user_id: 1 })
db.commentaires.createIndex({ signalements: -1 })

// demandes
db.demandes.createIndex({ oeuvre_id: 1 })
db.demandes.createIndex({ user_id: 1 })
db.demandes.createIndex({ statut: 1 })
db.demandes.createIndex(
  { user_id: 1, oeuvre_id: 1 },
  { unique: true, partialFilterExpression: { statut: "en_attente" } }
)

// expositions
db.expositions.createIndex({ statut: 1 })
db.expositions.createIndex({ created_at: -1 })

// articles
db.articles.createIndex({ rubrique: 1 })
db.articles.createIndex({ featured: 1 })
db.articles.createIndex({ created_at: -1 })
db.articles.createIndex({ titre: "text", excerpt: "text" })

// questions
db.questions.createIndex({ user_id: 1 })
db.questions.createIndex({ created_at: -1 })

// notifications
db.notifications.createIndex({ user_id: 1 })
db.notifications.createIndex({ user_id: 1, read: 1 })
db.notifications.createIndex({ created_at: -1 })

// Administrateur par défaut
db.users.insertOne({
  username:   "admin",
  email:      "admin@wart.cm",
  password:   "$sha%JEDI$",
  role:       "admin",
  is_banned:  false,
  created_at: new Date(),
})

