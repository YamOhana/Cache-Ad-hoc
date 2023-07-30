const express = require('express');
const router = express.Router();
const adHocController = require('../controllers/adHocController');
const logger = require('../logger'); 

router.post('/cache/refresh/:objectId', async (req, res) => {
  const { objectId } = req.params;

  logger.info('Ad-hoc cache refresh request received for object ID:', objectId);

  try {
    const result = await adHocController.adHocCacheRefresh(objectId);
    return res.status(200).json({ success: true, result });
  } catch (err) {
    logger.error('Error in adHocCacheRefresh route:', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
