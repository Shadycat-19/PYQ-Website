const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

// Require DB to initialize tables on startup
require('./database/db');

const papersRouter = require('./routes/papers');
const solutionsRouter = require('./routes/solutions');

const app = express();
const PORT = process.env.PORT || 8765;

// Enable CORS & JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.use('/api/papers', papersRouter);
app.use('/api/solutions', solutionsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PYQ Website Backend is running smoothly.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large! Maximum allowed size is 15MB per image.' });
    }
    return res.status(400).json({ error: `File upload error: ${err.message}` });
  }

  if (err.message && err.message.includes('Only image files')) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({
    error: err.message || 'An unexpected server error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 PYQ Backend running on http://localhost:${PORT}`);
  console.log(`📁 Static files at http://localhost:${PORT}/uploads/`);
  console.log(`=================================`);
});
