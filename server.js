import express from "express";
import path from "path";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

// --- Simuler une base de données en mémoire
let leaderboard = [];

// 🔹 Enregistrer ou mettre à jour un score
app.post("/api/score", (req, res) => {
  const { player, score } = req.body;
  let existing = leaderboard.find(p => p.player === player);

  if (existing) {
    existing.score = Math.max(existing.score, score);
  } else {
    leaderboard.push({ player, score });
  }

  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 10);

  res.json({ success: true });
});

// 🔹 Ajouter un bonus de parrainage
app.post("/api/referral", (req, res) => {
  const { referrer } = req.body;
  if (!referrer) return res.json({ success: false });

  let existing = leaderboard.find(p => p.player === referrer);

  if (existing) {
    existing.score += 50; // Bonus
  } else {
    leaderboard.push({ player: referrer, score: 50 });
  }

  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 10);

  res.json({ success: true, message: `${referrer} gagne +50 !` });
});

// 🔹 Renvoyer le classement
app.get("/api/leaderboard", (req, res) => {
  res.json(leaderboard);
});

// --- Lancer le serveur
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
