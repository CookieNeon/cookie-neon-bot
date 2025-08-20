import TelegramBot from "node-telegram-bot-api";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.BOT_TOKEN;
const URL = process.env.RENDER_EXTERNAL_URL; // ⚡ Render ajoute cette variable automatiquement

// Créer bot sans polling
const bot = new TelegramBot(TOKEN, { polling: false });

// Middleware pour JSON
app.use(express.json());

// Endpoint pour Telegram (reçoit les updates)
app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Lancer serveur
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);

  // Définir webhook sur l’URL Render
  bot.setWebHook(`${URL}/bot${TOKEN}`);
  console.log(`🤖 Webhook configuré sur ${URL}/bot${TOKEN}`);
});

// Exemple commande
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "👋 Hello ! Ton bot tourne avec Render 🚀");
});
