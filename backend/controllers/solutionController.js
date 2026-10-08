const db = require('../database/db');
const path = require('path');
const fs = require('fs');
const { streamPagesAsZip } = require('../utils/downloader');

function sanitizeName(str) {
  return str.replace(/[^a-zA-Z0-9_-]/g, '_');
}

// 1. Get all solutions for a paper
exports.getSolutionsForPaper = (req, res) => {
  try {
    const paperId = parseInt(req.params.paperId, 10);
    if (isNaN(paperId)) {
      return res.status(400).json({ error: 'Invalid paper ID' });
    }

    // Verify paper exists
    const paper = db.prepare('SELECT * FROM papers WHERE id = ?').get(paperId);
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found.' });
    }

    const solutions = db.prepare('SELECT * FROM solutions WHERE paper_id = ? ORDER BY upload_date ASC').all(paperId);

    const enrichedSolutions = solutions.map((sol, index) => {
      const pages = db.prepare(`
        SELECT id, file_path, page_number 
        FROM solution_pages 
        WHERE solution_id = ? 
        ORDER BY page_number ASC
      `).all(sol.id);

      return {
        ...sol,
        solution_label: `Solution ${index + 1}`,
        pages,
        page_count: pages.length
      };
    });

    res.json({
      paper,
      solutions: enrichedSolutions
    });
  } catch (error) {
    console.error('Error fetching solutions:', error);
    res.status(500).json({ error: 'Failed to retrieve solutions.' });
  }
};

// 2. Upload solution for a paper
exports.createSolution = (req, res) => {
  try {
    const paperId = parseInt(req.params.paperId, 10);
    const files = req.files;

    if (isNaN(paperId)) {
      return res.status(400).json({ error: 'Invalid paper ID.' });
    }

    // Ensure paper exists
    const paper = db.prepare('SELECT * FROM papers WHERE id = ?').get(paperId);
    if (!paper) {
      return res.status(404).json({ error: 'Cannot add solution. Question paper does not exist.' });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'At least one solution image is required.' });
    }

    // Insert solution record
    const insertSolution = db.prepare(`
      INSERT INTO solutions (paper_id)
      VALUES (?)
    `);

    const result = insertSolution.run(paperId);
    const solutionId = result.lastInsertRowid;

    // Insert solution pages
    const insertPage = db.prepare(`
      INSERT INTO solution_pages (solution_id, file_path, page_number)
      VALUES (?, ?, ?)
    `);

    const pages = [];
    files.forEach((file, index) => {
      const relativePath = `uploads/solutions/${file.filename}`;
      const pageNum = index + 1;
      const pageRes = insertPage.run(solutionId, relativePath, pageNum);

      pages.push({
        id: pageRes.lastInsertRowid,
        file_path: relativePath,
        page_number: pageNum
      });
    });

    // Count existing solutions to give correct label
    const totalSols = db.prepare('SELECT COUNT(*) as count FROM solutions WHERE paper_id = ?').get(paperId).count;

    res.status(201).json({
      message: 'Solution uploaded successfully!',
      solution: {
        id: solutionId,
        paper_id: paperId,
        solution_label: `Solution ${totalSols}`,
        upload_date: new Date().toISOString(),
        pages,
        page_count: pages.length
      }
    });
  } catch (error) {
    console.error('Error creating solution:', error);
    res.status(500).json({ error: 'Failed to save solution.' });
  }
};

// 3. Download solution package
exports.downloadSolution = (req, res) => {
  try {
    const solutionId = parseInt(req.params.id, 10);
    const sol = db.prepare('SELECT * FROM solutions WHERE id = ?').get(solutionId);

    if (!sol) {
      return res.status(404).json({ error: 'Solution not found.' });
    }

    const paper = db.prepare('SELECT * FROM papers WHERE id = ?').get(sol.paper_id);
    const pages = db.prepare('SELECT file_path, page_number FROM solution_pages WHERE solution_id = ? ORDER BY page_number ASC').all(solutionId);

    if (pages.length === 0) {
      return res.status(404).json({ error: 'No solution pages found.' });
    }

    // Determine solution index
    const allSols = db.prepare('SELECT id FROM solutions WHERE paper_id = ? ORDER BY upload_date ASC').all(sol.paper_id);
    const solIndex = allSols.findIndex(s => s.id === solutionId) + 1;

    const filename = paper 
      ? `${sanitizeName(paper.course)}_${paper.year}_${sanitizeName(paper.exam_type)}_Solution_${solIndex}.zip`
      : `Solution_${solutionId}.zip`;

    streamPagesAsZip(pages, filename, res);
  } catch (error) {
    console.error('Error downloading solution:', error);
    res.status(500).json({ error: 'Failed to download solution.' });
  }
};
