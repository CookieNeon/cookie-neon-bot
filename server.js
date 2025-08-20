const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Dossier public pour les fichiers statiques (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Route principale → index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Exemple API pour le bot (tu pourras modifier/ajouter tes endpoints ici)
app.get("/api/status", (req, res) => {
  res.json({ status: "✅ Cookie Neon Bot en ligne !" });
});

// Lancer serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
