import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ==================
// 🚀 API EXPRESS
// ==================
app.get("/", (req, res) => {
  res.send("🚀 Cookie Neon Bot is running!");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// ==================
// 🤖 BOT TELEGRAM
// ==================
const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error("❌ ERROR: BOT_TOKEN is missing in environment variables!");
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "🍪 Bienvenue sur Cookie Neon Bot ! Tape 'cookie' pour gagner un cookie."
  );
});

bot.onText(/cookie/, (msg) => {
  bot.sendMessage(msg.chat.id, "😋 Tu as trouvé un cookie !");
});

console.log("🤖 Telegram Bot is running...");
