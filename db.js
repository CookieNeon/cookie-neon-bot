import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'cookie.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tg_id INTEGER UNIQUE,
  username TEXT,
  points INTEGER DEFAULT 0,
  tap_count_today INTEGER DEFAULT 0,
  last_tap_reset TEXT,
  last_bonus TEXT,
  referrer_tg_id INTEGER
);

CREATE TABLE IF NOT EXISTS referrals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  referrer_tg_id INTEGER,
  referred_tg_id INTEGER UNIQUE,
  created_at TEXT DEFAULT (datetime('now'))
);
`);

export function getUserByTgId(tg_id){
  const stmt = db.prepare('SELECT * FROM users WHERE tg_id = ?');
  return stmt.get(tg_id);
}

export function createUser({ tg_id, username, referrer_tg_id }){
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO users (tg_id, username, points, tap_count_today, last_tap_reset, last_bonus, referrer_tg_id)
    VALUES (@tg_id, @username, 0, 0, NULL, NULL, @referrer_tg_id)
  `);
  stmt.run({ tg_id, username, referrer_tg_id });
  return getUserByTgId(tg_id);
}

export function setUsername(tg_id, username){
  const stmt = db.prepare('UPDATE users SET username = ? WHERE tg_id = ?');
  stmt.run(username, tg_id);
}

export function addPoints(tg_id, pts){
  const stmt = db.prepare('UPDATE users SET points = points + ? WHERE tg_id = ?');
  stmt.run(pts, tg_id);
}

export function getPoints(tg_id){
  const stmt = db.prepare('SELECT points FROM users WHERE tg_id = ?');
  const row = stmt.get(tg_id);
  return row ? row.points : 0;
}

export function resetTapIfNeeded(tg_id){
  const user = getUserByTgId(tg_id);
  const todayUTC = new Date().toISOString().slice(0,10); // YYYY-MM-DD
  if (!user.last_tap_reset || user.last_tap_reset !== todayUTC){
    const stmt = db.prepare('UPDATE users SET tap_count_today = 0, last_tap_reset = ? WHERE tg_id = ?');
    stmt.run(todayUTC, tg_id);
  }
}

export function addTaps(tg_id, count){
  const stmt = db.prepare('UPDATE users SET tap_count_today = tap_count_today + ? WHERE tg_id = ?');
  stmt.run(count, tg_id);
}

export function getTapCountToday(tg_id){
  const stmt = db.prepare('SELECT tap_count_today, last_tap_reset FROM users WHERE tg_id = ?');
  return stmt.get(tg_id);
}

export function grantDailyBonusIfEligible(tg_id, bonus){
  const todayUTC = new Date().toISOString().slice(0,10);
  const row = db.prepare('SELECT last_bonus FROM users WHERE tg_id = ?').get(tg_id);
  if (!row.last_bonus || row.last_bonus !== todayUTC){
    addPoints(tg_id, bonus);
    db.prepare('UPDATE users SET last_bonus = ? WHERE tg_id = ?').run(todayUTC, tg_id);
    return true;
  }
  return false;
}

export function addReferral(referrer_tg_id, referred_tg_id){
  const exists = db.prepare('SELECT * FROM referrals WHERE referred_tg_id = ?').get(referred_tg_id);
  if (exists) return false;
  db.prepare('INSERT INTO referrals (referrer_tg_id, referred_tg_id) VALUES (?, ?)').run(referrer_tg_id, referred_tg_id);
  // store referrer on user if not set
  db.prepare('UPDATE users SET referrer_tg_id = ? WHERE tg_id = ? AND (referrer_tg_id IS NULL OR referrer_tg_id = 0)').run(referrer_tg_id, referred_tg_id);
  return true;
}

export default db;
