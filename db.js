const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(path.resolve(__dirname, "cookie.db"));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT,
      score INTEGER DEFAULT 0,
      last_bonus DATE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS referrals (
      referrer_id TEXT,
      referred_id TEXT UNIQUE
    )
  `);
});

function addUser(id, username, callback) {
  db.run(
    `INSERT OR IGNORE INTO users (id, username, score) VALUES (?, ?, 0)`,
    [id, username],
    callback
  );
}

function getUser(id, callback) {
  db.get(`SELECT * FROM users WHERE id = ?`, [id], callback);
}

function updateScore(id, amount, callback) {
  db.run(`UPDATE users SET score = score + ? WHERE id = ?`, [amount, id], callback);
}

function dailyBonus(id, callback) {
  const today = new Date().toISOString().split("T")[0];
  db.get(`SELECT last_bonus FROM users WHERE id = ?`, [id], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback("Utilisateur inexistant");

    if (row.last_bonus !== today) {
      db.run(
        `UPDATE users SET score = score + 25, last_bonus = ? WHERE id = ?`,
        [today, id],
        (err2) => callback(err2, true)
      );
    } else {
      callback(null, false);
    }
  });
}

function addReferral(referrer_id, referred_id, callback) {
  db.run(
    `INSERT OR IGNORE INTO referrals (referrer_id, referred_id) VALUES (?, ?)`,
    [referrer_id, referred_id],
    (err) => {
      if (err) return callback(err);
      updateScore(referrer_id, 100, callback);
    }
  );
}

function getLeaderboard(callback) {
  db.all(
    `SELECT username, score FROM users ORDER BY score DESC LIMIT 10`,
    [],
    callback
  );
}

module.exports = { addUser, getUser, updateScore, dailyBonus, addReferral, getLeaderboard };
