import express from "express";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- SERVER (pour Render) ---
app.get("/", (req, res) => {
  res.send("🚀 Cookie Neon Bot is running!");
});

app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});

// --- TELEGRAM BOT ---
const TOKEN = process.env.BOT_TOKEN;
if (!TOKEN) {
  console.error("❌ BOT_TOKEN is missing in .env");
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

// Exemple de commande /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "👋 Bienvenue sur Cookie Neon Bot !");
});

// Exemple réponse à un message texte
bot.on("message", (msg) => {
  if (msg.text && msg.text.toLowerCase() === "cookie") {
    bot.sendMessage(msg.chat.id, "🍪 Voici ton cookie !");
  }
});
