const TelegramBot = require("node-telegram-bot-api");
const db = require("./db");

const token = process.env.BOT_TOKEN; // à définir sur Render
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start(?:\s+(\S+))?/, (msg, match) => {
  const chatId = msg.chat.id.toString();
  const username = msg.from.username || `user${chatId}`;
  const referrerId = match[1];

  db.addUser(chatId, username, () => {
    if (referrerId && referrerId !== chatId) {
      db.addReferral(referrerId, chatId, () => {
        bot.sendMessage(chatId, "Tu as rejoint via un lien d’invitation 🎉");
        bot.sendMessage(referrerId, `Ton ami @${username} t’a rapporté +100 points !`);
      });
    }
  });

  bot.sendMessage(chatId, `Bienvenue @${username} 🎮\nJoue ici 👉 https://cookie-neon-bot.onrender.com`);
});

bot.onText(/\/score/, (msg) => {
  const chatId = msg.chat.id.toString();
  db.getUser(chatId, (err, user) => {
    if (!user) return bot.sendMessage(chatId, "Aucun score trouvé.");
    bot.sendMessage(chatId, `Ton score actuel est : ${user.score} 🍪`);
  });
});

bot.onText(/\/leaderboard/, (msg) => {
  const chatId = msg.chat.id.toString();
  db.getLeaderboard((err, rows) => {
    if (err) return;
    let text = "🏆 Classement :\n";
    rows.forEach((u, i) => {
      text += `#${i + 1} ${u.username || "Anonyme"} - ${u.score} pts\n`;
    });
    bot.sendMessage(chatId, text);
  });
});

module.exports = bot;
