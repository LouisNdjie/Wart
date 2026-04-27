import express from "express";
import cors from "cors";
import records from "./routes/records.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/records", records);

// Lancement dun serveur *
app.listen(PORT, () => {
  console.log(`le serveur écoute sur le port ${PORT}`);
});




mongodb+srv://dbWart:dbWartPassword@cluster0.ad768gt.mongodb.net/?appName=Cluster0