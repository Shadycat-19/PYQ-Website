const db = require('../database/db');
const path = require('path');
const fs = require('fs');
const { streamPagesAsZip } = require('../utils/downloader');

// Helper to sanitize filename strings
function sanitizeName(str) {
  return str.replace(/[^a-zA-Z0-9_-]/g, '_');
}

// 1. Check duplicate paper by course, year, exam_type
exports.checkDuplicate = (req, res) => {
  try {
    const { course, year, exam_type } = req.query;

    if (!course || !year || !exam_type) {
      return res.status(400).json({ error: 'course, year, and exam_type query parameters are required.' });
    }

    const trimmedCourse = course.trim();
    const parsedYear = parseInt(year, 10);
    const trimmedExamType = exam_type.trim();

    const stmt = db.prepare(`
      SELECT * FROM papers 
      WHERE LOWER(course) = LOWER(?) AND year = ? AND LOWER(exam_type) = LOWER(?)
      ORDER BY upload_date DESC
      LIMIT 1
    `);

    const existingPaper = stmt.get(trimmedCourse, parsedYear, trimmedExamType);

    if (existingPaper) {
      // Get page count
      const pageStmt = db.prepare('SELECT COUNT(*) as count FROM paper_pages WHERE paper_id = ?');
      const pageCount = pageStmt.get(existingPaper.id).count;

      return res.json({
        exists: true,
        existingPaper: {
          ...existingPaper,
          page_count: pageCount
        }
      });
    }

    return res.json({ exists: false, existingPaper: null });
  } catch (error) {
    console.error('Error checking duplicate:', error);
    return res.status(500).json({ error: 'Database error checking for duplicate paper.' });
  }
};

// 2. Get all papers with filters & search
exports.getPapers = (req, res) => {
  try {
    const { course, year, exam_type, search } = req.query;

    let query = 'SELECT * FROM papers WHERE 1=1';
    const params = [];

    if (course && course !== 'All') {
      query += ' AND LOWER(course) = LOWER(?)';
      params.push(course.trim());
    }

    if (year && year !== 'All') {
      query += ' AND year = ?';
      params.push(parseInt(year, 10));
    }

    if (exam_type && exam_type !== 'All') {
      query += ' AND LOWER(exam_type) = LOWER(?)';
      params.push(exam_type.trim());
    }

    if (search && search.trim() !== '') {
      const searchTerm = `%${search.trim().toLowerCase()}%`;
      query += ' AND (LOWER(course) LIKE ? OR CAST(year AS TEXT) LIKE ? OR LOWER(exam_type) LIKE ?)';
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY upload_date DESC';

    const stmt = db.prepare(query);
    const papers = stmt.all(...params);

    // Enrich with page count, thumbnail (first page), and solution count
    const enrichedPapers = papers.map(paper => {
      const pagesStmt = db.prepare('SELECT file_path FROM paper_pages WHERE paper_id = ? ORDER BY page_number ASC');
      const pages = pagesStmt.all(paper.id);

      const solStmt = db.prepare('SELECT COUNT(*) as count FROM solutions WHERE paper_id = ?');
      const solCount = solStmt.get(paper.id).count;

      return {
        ...paper,
        page_count: pages.length,
        thumbnail: pages.length > 0 ? pages[0].file_path : null,
        solutions_count: solCount
      };
    });

    res.json(enrichedPapers);
  } catch (error) {
    console.error('Error fetching papers:', error);
    res.status(500).json({ error: 'Failed to retrieve question papers.' });
  }
};

// 3. Get single paper details with pages
exports.getPaperById = (req, res) => {
  try {
    const paperId = parseInt(req.params.id, 10);
    if (isNaN(paperId)) {
      return res.status(400).json({ error: 'Invalid paper ID' });
    }

    const paperStmt = db.prepare('SELECT * FROM papers WHERE id = ?');
    const paper = paperStmt.get(paperId);

    if (!paper) {
      return res.status(404).json({ error: 'Question paper not found.' });
    }

    const pagesStmt = db.prepare('SELECT id, file_path, page_number FROM paper_pages WHERE paper_id = ? ORDER BY page_number ASC');
    const pages = pagesStmt.all(paperId);

    const solStmt = db.prepare('SELECT COUNT(*) as count FROM solutions WHERE paper_id = ?');
    const solCount = solStmt.get(paperId).count;

    res.json({
      ...paper,
      pages,
      page_count: pages.length,
      solutions_count: solCount
    });
  } catch (error) {
    console.error('Error fetching paper details:', error);
    res.status(500).json({ error: 'Failed to retrieve paper details.' });
  }
};

// 4. Upload a new paper
exports.createPaper = (req, res) => {
  try {
    const { course, year, exam_type } = req.body;
    const files = req.files;

    if (!course || !course.trim()) {
      return res.status(400).json({ error: 'Course name is required.' });
    }
    if (!year || isNaN(parseInt(year, 10))) {
      return res.status(400).json({ error: 'Valid Year is required.' });
    }
    if (!exam_type || !exam_type.trim()) {
      return res.status(400).json({ error: 'Exam type is required.' });
    }
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'At least one paper image page is required.' });
    }

    const trimmedCourse = course.trim();
    const parsedYear = parseInt(year, 10);
    const trimmedExamType = exam_type.trim();

    // Insert paper
    const insertPaper = db.prepare(`
      INSERT INTO papers (course, year, exam_type)
      VALUES (?, ?, ?)
    `);

    const result = insertPaper.run(trimmedCourse, parsedYear, trimmedExamType);
    const paperId = result.lastInsertRowid;

    // Insert pages
    const insertPage = db.prepare(`
      INSERT INTO paper_pages (paper_id, file_path, page_number)
      VALUES (?, ?, ?)
    `);

    const pages = [];
    files.forEach((file, index) => {
      // relative path stored in database
      const relativePath = `uploads/papers/${file.filename}`;
      const pageNum = index + 1;
      const pageRes = insertPage.run(paperId, relativePath, pageNum);

      pages.push({
        id: pageRes.lastInsertRowid,
        file_path: relativePath,
        page_number: pageNum
      });
    });

    res.status(201).json({
      message: 'Question paper uploaded successfully!',
      paper: {
        id: paperId,
        course: trimmedCourse,
        year: parsedYear,
        exam_type: trimmedExamType,
        upload_date: new Date().toISOString(),
        pages,
        page_count: pages.length,
        solutions_count: 0
      }
    });
  } catch (error) {
    console.error('Error creating paper:', error);
    res.status(500).json({ error: 'Failed to save question paper.' });
  }
};

// 5. Download paper package
exports.downloadPaper = (req, res) => {
  try {
    const paperId = parseInt(req.params.id, 10);
    const paperStmt = db.prepare('SELECT * FROM papers WHERE id = ?');
    const paper = paperStmt.get(paperId);

    if (!paper) {
      return res.status(404).json({ error: 'Question paper not found.' });
    }

    const pagesStmt = db.prepare('SELECT file_path, page_number FROM paper_pages WHERE paper_id = ? ORDER BY page_number ASC');
    const pages = pagesStmt.all(paperId);

    if (pages.length === 0) {
      return res.status(404).json({ error: 'No paper pages available for download.' });
    }

    const filename = `${sanitizeName(paper.course)}_${paper.year}_${sanitizeName(paper.exam_type)}_Paper.zip`;
    streamPagesAsZip(pages, filename, res);
  } catch (error) {
    console.error('Error downloading paper:', error);
    res.status(500).json({ error: 'Failed to prepare download.' });
  }
};

// 6. Get available meta options (Courses, Years, Exam Types)
exports.getMetaOptions = (req, res) => {
  try {
    const courses = db.prepare('SELECT DISTINCT course FROM papers ORDER BY course ASC').all().map(r => r.course);
    const years = db.prepare('SELECT DISTINCT year FROM papers ORDER BY year DESC').all().map(r => r.year);
    const examTypes = db.prepare('SELECT DISTINCT exam_type FROM papers ORDER BY exam_type ASC').all().map(r => r.exam_type);

    res.json({
      courses,
      years,
      examTypes
    });
  } catch (error) {
    console.error('Error fetching meta options:', error);
    res.status(500).json({ error: 'Failed to retrieve search metadata.' });
  }
};

// 7. Delete paper by ID
exports.deletePaper = (req, res) => {
  try {
    const paperId = parseInt(req.params.id, 10);
    if (isNaN(paperId)) {
      return res.status(400).json({ error: 'Invalid paper ID' });
    }

    const paper = db.prepare('SELECT * FROM papers WHERE id = ?').get(paperId);
    if (!paper) {
      return res.status(404).json({ error: 'Question paper not found.' });
    }

    // 1. Delete associated paper page files
    const paperPages = db.prepare('SELECT file_path FROM paper_pages WHERE paper_id = ?').all(paperId);
    paperPages.forEach((page) => {
      const fullPath = path.join(__dirname, '../../', page.file_path);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (e) {
          console.error(`Failed to delete paper file ${fullPath}:`, e);
        }
      }
    });

    // 2. Delete associated solution page files
    const solutions = db.prepare('SELECT id FROM solutions WHERE paper_id = ?').all(paperId);
    solutions.forEach((sol) => {
      const solutionPages = db.prepare('SELECT file_path FROM solution_pages WHERE solution_id = ?').all(sol.id);
      solutionPages.forEach((page) => {
        const fullPath = path.join(__dirname, '../../', page.file_path);
        if (fs.existsSync(fullPath)) {
          try {
            fs.unlinkSync(fullPath);
          } catch (e) {
            console.error(`Failed to delete solution file ${fullPath}:`, e);
          }
        }
      });
    });

    // 3. Delete from database (cascade deletes paper_pages, solutions, solution_pages)
    db.prepare('DELETE FROM papers WHERE id = ?').run(paperId);

    return res.json({ message: 'Question paper deleted successfully.' });
  } catch (error) {
    console.error('Error deleting paper:', error);
    return res.status(500).json({ error: 'Failed to delete question paper.' });
  }
};
