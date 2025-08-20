const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.BOT_TOKEN;

// Crée le bot (en mode webhook)
const bot = new TelegramBot(TOKEN, { polling: false });

// Middlewares
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // sert tout le dossier public

// ✅ Route pour ton jeu
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Route webhook Telegram
app.post("/webhook", (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// ✅ Route test simple
app.get("/ping", (req, res) => {
  res.send("✅ Cookie Neon Bot est en ligne !");
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur en ligne sur le port ${PORT}`);
});
