const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Servir le dossier public (où se trouve index.html, styles.css, app.js…)
app.use(express.static(path.join(__dirname, "public")));

// Rediriger "/" vers public/index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Cookie Neon Bot est en ligne sur le port ${PORT}`);
});
