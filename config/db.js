const sqlite3 = require('sqlite3').verbose();

const { open } = require('sqlite');


const path = require('path');

const DB_PATH = path.join(__dirname, '../calories.db');

// Initialize and export the database connection
async function init()
{
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  // Create calories table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS calories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      timestamp TEXT NOT NULL
    );
  `);

  // Optional users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      display_name TEXT
    );
  `);

  return db;
}

// Export the init function
module.exports = { init };
