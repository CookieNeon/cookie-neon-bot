const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db");
require("./bot"); // lance aussi le bot Telegram

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/play", (req, res) => {
  const { userId } = req.body;
  db.updateScore(userId, 1, (err) => {
    if (err) return res.status(500).json({ error: err });
    db.getUser(userId, (err2, user) => {
      res.json({ score: user.score });
    });
  });
});

app.post("/bonus", (req, res) => {
  const { userId } = req.body;
  db.dailyBonus(userId, (err, given) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ bonusGiven: given });
  });
});

app.get("/leaderboard", (req, res) => {
  db.getLeaderboard((err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

app.listen(PORT, () => console.log(`🚀 Cookie Neon Bot online sur port ${PORT}`));
