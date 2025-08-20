import express from "express";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import { initDb, openDb } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.BOT_TOKEN;
const URL = process.env.RENDER_EXTERNAL_URL;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// --- API SCORE --- //
app.get("/score/:user_id", async (req, res) => {
  const db = await openDb();
  const user_id = req.params.user_id;
  const row = await db.get("SELECT score FROM scores WHERE user_id = ?", [user_id]);
  res.json({ score: row ? row.score : 0 });
});

app.post("/score", async (req, res) => {
  const { user_id, username, score } = req.body;
  const db = await openDb();

  // Vérifie si l'utilisateur existe déjà
  const existing = await db.get("SELECT score FROM scores WHERE user_id = ?", [user_id]);

  if (existing) {
    // Mettre à jour si meilleur score
    if (score > existing.score) {
      await db.run("UPDATE scores SET score = ?, username = ? WHERE user_id = ?", [
        score,
        username,
        user_id,
      ]);
    }
  } else {
    // Nouvel utilisateur
    await db.run("INSERT INTO scores (user_id, username, score) VALUES (?, ?, ?)", [
      user_id,
      username,
      score,
    ]);
  }

  res.json({ success: true });
});

// --- TELEGRAM --- //
const bot = new TelegramBot(TOKEN, { polling: false });

app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);
  await initDb();
  bot.setWebHook(`${URL}/bot${TOKEN}`);
  console.log(`🤖 Webhook configuré sur ${URL}/bot${TOKEN}`);
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || msg.from.first_name;

  bot.sendMessage(chatId, `👋 Bienvenue ${username} sur Cookie Neon Bot !`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🚀 Jouer maintenant",
            web_app: { url: `${URL}/index.html?user_id=${msg.from.id}&username=${username}` },
          },
        ],
      ],
    },
  });
});
