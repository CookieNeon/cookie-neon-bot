import TelegramBot from "node-telegram-bot-api";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.BOT_TOKEN;
const URL = process.env.RENDER_EXTERNAL_URL || "https://cookie-neon-bot.onrender.com";

// ✅ Vérification que le token est bien défini
if (!TOKEN) {
  console.error("❌ BOT_TOKEN manquant. Ajoute-le dans ton fichier .env ou Render > Environment");
  process.exit(1);
}

// 🔗 Bot sans polling (Webhook obligatoire sur Render)
const bot = new TelegramBot(TOKEN, { polling: false });

// Middleware JSON
app.use(express.json());

// Route d’accueil pour tester ton Render
app.get("/", (req, res) => {
  res.send("🚀 Cookie Neon Bot est en ligne !");
});

// Endpoint Webhook pour Telegram
app.post(`/webhook`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Lancer le serveur
app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);

  // Configurer le webhook sur l’URL Render
  const webhookUrl = `${URL}/webhook`;
  try {
    await bot.setWebHook(webhookUrl);
    console.log(`🤖 Webhook configuré sur ${webhookUrl}`);
  } catch (err) {
    console.error("❌ Erreur Webhook :", err.message);
  }
});

// Exemple de commande /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 Bienvenue sur *Cookie Neon Bot* !\n\nClique ici pour jouer 👉 [Lancer le jeu](https://cookie-neon-bot.onrender.com/index.html)",
    { parse_mode: "Markdown" }
  );
});

// Exemple commande /play
bot.onText(/\/play/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "🍪 Clique ici pour jouer au jeu : [Jouer](https://cookie-neon-bot.onrender.com/index.html)",
    { parse_mode: "Markdown" }
  );
});
