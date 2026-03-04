const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '../../../data');
const DB_PATH = path.join(DATA_DIR, 'weather.sqlite');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let db;

function initializeDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  db = new DatabaseSync(DB_PATH);

  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  db.exec(schema);

  console.log('Database initialized at:', DB_PATH);
  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

module.exports = { initializeDatabase, getDb };
