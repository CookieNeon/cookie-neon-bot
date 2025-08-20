import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Fonction pour ouvrir la base
export async function openDb() {
  return open({
    filename: "./cookie.db",
    driver: sqlite3.Database,
  });
}

// Initialiser la table
export async function initDb() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT UNIQUE,
      username TEXT,
      score INTEGER DEFAULT 0
    )
  `);
  return db;
}
