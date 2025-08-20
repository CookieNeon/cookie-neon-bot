const express = require("express");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const port = process.env.PORT || 3000;

// ✅ Sert les fichiers statiques depuis /public
app.use(express.static("public"));

// Middleware pour parser JSON
app.use(bodyParser.json());

// Ton token Telegram (⚠️ sécurise-le via Render Environment Variables)
const token = process.env.TELEGRAM_TOKEN || "TON_TOKEN_ICI";
const bot = new TelegramBot(token, { polling: false });

// ✅ Route webhook pour Telegram
app.post("/webhook", (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// ✅ Petite route test pour vérifier que le serveur tourne
app.get("/", (req, res) => {
  res.send("✅ Cookie Neon Bot est en ligne !");
});

// ✅ Exemple basique de réponse au /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 Bienvenue dans le Cookie Neon Bot ! Clique ici pour jouer : https://cookie-neon-bot.onrender.com/index.html"
  );
});

// Lancer serveur
app.listen(port, () => {
  console.log(`🚀 Serveur en ligne sur http://localhost:${port}`);
});
