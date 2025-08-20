const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Sert automatiquement les fichiers dans /public
app.use(express.static(path.join(__dirname, "public")));

// Route par défaut → index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur en ligne sur http://localhost:${PORT}`);
});
