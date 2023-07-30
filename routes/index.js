const express = require('express');
const adHocRoutes = require('./adHocRoutes');
const batchRoutes = require('./batchRoutes');

const router = express.Router();

router.use('/ad-hoc', adHocRoutes);
router.use('/batch', batchRoutes);

module.exports = router;
