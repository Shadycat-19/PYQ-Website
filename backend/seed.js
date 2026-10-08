const db = require('./database/db');
const fs = require('fs');
const path = require('path');

// Ensure directories exist
const papersDir = path.join(__dirname, '../uploads/papers');
const solutionsDir = path.join(__dirname, '../uploads/solutions');
[papersDir, solutionsDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// A minimal valid 100x100 PNG image buffer generator in Node.js
function generateSamplePng(text, color) {
  // SVG markup with clear text
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100" viewBox="0 0 800 1100">
    <rect width="800" height="1100" fill="#f8fafc"/>
    <rect x="20" y="20" width="760" height="1060" rx="15" fill="#ffffff" stroke="#cbd5e1" stroke-width="4"/>
    <rect x="50" y="50" width="700" height="90" rx="10" fill="${color}"/>
    <text x="70" y="105" font-family="sans-serif" font-size="28" font-weight="bold" fill="#ffffff">${text}</text>
    <text x="70" y="180" font-family="sans-serif" font-size="20" font-weight="bold" fill="#334155">SECTION A - ANSWER ALL QUESTIONS</text>
    <line x1="70" y1="195" x2="730" y2="195" stroke="#94a3b8" stroke-width="2"/>
    <text x="70" y="240" font-family="sans-serif" font-size="16" fill="#475569">Q1. (a) Explain the time complexity of QuickSort in worst and average cases. [5 Marks]</text>
    <text x="70" y="280" font-family="sans-serif" font-size="16" fill="#475569">    (b) Describe how AVL Tree balancing occurs after insertion with example. [5 Marks]</text>
    <text x="70" y="360" font-family="sans-serif" font-size="20" font-weight="bold" fill="#334155">SECTION B - LONGER PROBLEMS</text>
    <line x1="70" y1="375" x2="730" y2="375" stroke="#94a3b8" stroke-width="2"/>
    <text x="70" y="420" font-family="sans-serif" font-size="16" fill="#475569">Q2. Construct a B-Tree of order 3 for the keys: 10, 20, 5, 6, 12, 30, 7, 17. [10 Marks]</text>
    <text x="70" y="470" font-family="sans-serif" font-size="16" fill="#475569">Q3. Implement Dijkstra's Algorithm step-by-step for the given weighted graph. [10 Marks]</text>
    <rect x="70" y="520" width="660" height="300" fill="#f1f5f9" stroke="#94a3b8" stroke-dasharray="6,6" rx="10"/>
    <text x="320" y="680" font-family="sans-serif" font-size="18" fill="#64748b">[ Diagram / Graph Area ]</text>
    <text x="350" y="1020" font-family="sans-serif" font-size="14" fill="#94a3b8">Page 1 of 2</text>
  </svg>`;
  return Buffer.from(svg);
}

function generateSolutionSvg(title) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100" viewBox="0 0 800 1100">
    <rect width="800" height="1100" fill="#faf5ff"/>
    <rect x="20" y="20" width="760" height="1060" rx="15" fill="#ffffff" stroke="#e9d5ff" stroke-width="4"/>
    <rect x="50" y="50" width="700" height="80" rx="10" fill="#7e22ce"/>
    <text x="70" y="100" font-family="sans-serif" font-size="24" font-weight="bold" fill="#ffffff">SOLUTION: ${title}</text>
    <text x="70" y="180" font-family="sans-serif" font-size="18" font-weight="bold" fill="#581c87">Solution Step 1:</text>
    <text x="70" y="215" font-family="sans-serif" font-size="15" fill="#3b0764">QuickSort Worst Case: O(n^2) when array is already sorted and pivot choice is naive.</text>
    <text x="70" y="245" font-family="sans-serif" font-size="15" fill="#3b0764">Average Case: O(n log n) with balanced partitioning.</text>
    <rect x="70" y="290" width="660" height="200" fill="#f3e8ff" rx="10" stroke="#c084fc"/>
    <text x="90" y="330" font-family="sans-serif" font-size="15" font-weight="bold" fill="#6b21a8">Recurrence Relation: T(n) = 2T(n/2) + O(n)</text>
    <text x="90" y="370" font-family="sans-serif" font-size="15" fill="#581c87">By Master Theorem Case 2: T(n) = O(n log n)</text>
    <text x="350" y="1020" font-family="sans-serif" font-size="14" fill="#a855f7">Solution Page 1</text>
  </svg>`;
  return Buffer.from(svg);
}

function seed() {
  console.log('Seeding sample data...');

  // Check if papers already exist
  const existingCount = db.prepare('SELECT COUNT(*) as count FROM papers').get().count;
  if (existingCount > 0) {
    console.log('Database already has papers. Skipping seed.');
    return;
  }

  // Paper 1: Data Structures 2025 Endsem
  const fn1 = `paper_ds_2025_p1.svg`;
  const fn2 = `paper_ds_2025_p2.svg`;
  fs.writeFileSync(path.join(papersDir, fn1), generateSamplePng('Data Structures — 2025 Endsem', '#4338ca'));
  fs.writeFileSync(path.join(papersDir, fn2), generateSamplePng('Data Structures — 2025 Endsem (Page 2)', '#4338ca'));

  const p1 = db.prepare('INSERT INTO papers (course, year, exam_type) VALUES (?, ?, ?)').run('Data Structures', 2025, 'Endsem');
  db.prepare('INSERT INTO paper_pages (paper_id, file_path, page_number) VALUES (?, ?, ?)').run(p1.lastInsertRowid, `uploads/papers/${fn1}`, 1);
  db.prepare('INSERT INTO paper_pages (paper_id, file_path, page_number) VALUES (?, ?, ?)').run(p1.lastInsertRowid, `uploads/papers/${fn2}`, 2);

  // Solution for Paper 1
  const solFn = `solution_ds_2025_p1.svg`;
  fs.writeFileSync(path.join(solutionsDir, solFn), generateSolutionSvg('Data Structures 2025 Endsem Answers'));
  const s1 = db.prepare('INSERT INTO solutions (paper_id) VALUES (?)').run(p1.lastInsertRowid);
  db.prepare('INSERT INTO solution_pages (solution_id, file_path, page_number) VALUES (?, ?, ?)').run(s1.lastInsertRowid, `uploads/solutions/${solFn}`, 1);

  // Paper 2: DBMS 2024 Midsem
  const fn3 = `paper_dbms_2024_p1.svg`;
  fs.writeFileSync(path.join(papersDir, fn3), generateSamplePng('Database Management Systems — 2024 Midsem', '#0369a1'));
  const p2 = db.prepare('INSERT INTO papers (course, year, exam_type) VALUES (?, ?, ?)').run('DBMS', 2024, 'Midsem');
  db.prepare('INSERT INTO paper_pages (paper_id, file_path, page_number) VALUES (?, ?, ?)').run(p2.lastInsertRowid, `uploads/papers/${fn3}`, 1);

  // Paper 3: Operating Systems 2025 Midsem
  const fn4 = `paper_os_2025_p1.svg`;
  fs.writeFileSync(path.join(papersDir, fn4), generateSamplePng('Operating Systems — 2025 Midsem', '#6b21a8'));
  const p3 = db.prepare('INSERT INTO papers (course, year, exam_type) VALUES (?, ?, ?)').run('Operating Systems', 2025, 'Midsem');
  db.prepare('INSERT INTO paper_pages (paper_id, file_path, page_number) VALUES (?, ?, ?)').run(p3.lastInsertRowid, `uploads/papers/${fn4}`, 1);

  console.log('Sample data seeded successfully!');
}

seed();
