const express = require('express');
const router = express.Router();
const paperController = require('../controllers/paperController');
const solutionController = require('../controllers/solutionController');
const { uploadPaper, uploadSolution } = require('../middleware/upload');

// Paper routes
router.get('/', paperController.getPapers);
router.get('/check-duplicate', paperController.checkDuplicate);
router.get('/meta-options', paperController.getMetaOptions);
router.get('/:id', paperController.getPaperById);
router.post('/', uploadPaper.array('files', 20), paperController.createPaper);
router.get('/:id/download', paperController.downloadPaper);
router.delete('/:id', paperController.deletePaper);

// Solution routes tied to papers
router.get('/:paperId/solutions', solutionController.getSolutionsForPaper);
router.post('/:paperId/solutions', uploadSolution.array('files', 20), solutionController.createSolution);

module.exports = router;
