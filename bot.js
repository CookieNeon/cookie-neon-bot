import { Telegraf } from "telegraf";
import dotenv from "dotenv";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// 🚀 Commande /start
bot.start((ctx) => {
  ctx.reply(
    `Bienvenue ${ctx.from.first_name} 👋\n\nClique sur 🚀 pour jouer à CookieNeonBot !`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🚀 Ouvrir le jeu",
              web_app: { url: process.env.PUBLIC_BASE_URL }
            }
          ]
        ]
      }
    }
  );
});

// ✅ Commande /test
bot.command("test", (ctx) => {
  ctx.reply("✅ Bot & serveur sont en ligne !");
});

// Écoute des erreurs
bot.catch((err, ctx) => {
  console.error(`❌ Erreur pour ${ctx.updateType}`, err);
  ctx.reply("⚠️ Une erreur est survenue !");
});

// Démarrage du bot
bot.launch();
console.log("🤖 Bot Telegram lancé avec succès !");

