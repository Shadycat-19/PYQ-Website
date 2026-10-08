const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

/**
 * Creates and streams a ZIP file containing pages
 * @param {Array<{file_path: string, page_number: number}>} pages 
 * @param {string} zipFilename 
 * @param {object} res Express response object
 */
function streamPagesAsZip(pages, zipFilename, res) {
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${zipFilename}"`);

  const archive = archiver('zip', { zlib: { level: 9 } });

  archive.on('error', (err) => {
    console.error('Archiver error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate download package.' });
    }
  });

  archive.pipe(res);

  pages.forEach((page, index) => {
    const fullPath = path.join(__dirname, '../../', page.file_path);
    if (fs.existsSync(fullPath)) {
      const ext = path.extname(fullPath) || '.jpg';
      const entryName = `Page_${page.page_number || index + 1}${ext}`;
      archive.file(fullPath, { name: entryName });
    }
  });

  archive.finalize();
}

module.exports = {
  streamPagesAsZip
};
