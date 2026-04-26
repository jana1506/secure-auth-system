const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || './database.sqlite';
const db = new Database(dbPath);

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin','manager','user')) NOT NULL DEFAULT 'user',
    twofa_secret TEXT NOT NULL
  )
`);

// Helper functions
function createUser(name, email, hashedPassword, role, twofaSecret) {
  const stmt = db.prepare(`
    INSERT INTO users (name, email, hashed_password, role, twofa_secret)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(name, email, hashedPassword, role, twofaSecret);
  return info.lastInsertRowid;  // return the new user id
}

function findUserByEmail(email) {
  const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
  return stmt.get(email);  // returns the row (object) or undefined
}

function findUserById(id) {
  const stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
  return stmt.get(id);
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById
};