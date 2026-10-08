const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.join(__dirname, '../../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'pyq.sqlite');
const db = new DatabaseSync(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

// Initialize database schema
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS papers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course TEXT NOT NULL,
      year INTEGER NOT NULL,
      exam_type TEXT NOT NULL,
      upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS paper_pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      paper_id INTEGER NOT NULL,
      file_path TEXT NOT NULL,
      page_number INTEGER NOT NULL,
      FOREIGN KEY (paper_id) REFERENCES papers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS solutions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      paper_id INTEGER NOT NULL,
      upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (paper_id) REFERENCES papers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS solution_pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      solution_id INTEGER NOT NULL,
      file_path TEXT NOT NULL,
      page_number INTEGER NOT NULL,
      FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_papers_meta ON papers(course, year, exam_type);
  `);

  console.log('Database initialized successfully at:', dbPath);
}

initDatabase();

module.exports = db;
