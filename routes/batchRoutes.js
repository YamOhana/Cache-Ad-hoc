const express = require('express');
const batchController = require('../controllers/batchController');

const router = express.Router();
router.post('/refresh', batchController.batchCacheRefresh);

module.exports = router;
