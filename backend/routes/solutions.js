const express = require('express');
const router = express.Router();
const solutionController = require('../controllers/solutionController');

router.get('/:id/download', solutionController.downloadSolution);

module.exports = router;
