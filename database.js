const sqlite3 = require('sqlite3').verbose();

// Create a new SQLite database (or open existing one)
const db = new sqlite3.Database('./database.sqlite');

// Create User and Address tables with a foreign key relationship
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS User (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Address (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      address TEXT NOT NULL,
      FOREIGN KEY(userId) REFERENCES User(id) ON DELETE CASCADE
    )
  `);
});

module.exports = db;
