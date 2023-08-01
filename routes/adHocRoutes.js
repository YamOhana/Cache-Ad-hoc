const express = require('express');
const adHocController = require('../controllers/adHocController');
const logger = require('../config/logger');

const router = express.Router();

router.post('/refresh/:objectId', async (req, res) => {
  try {
    const { objectId } = req.params;
    const payload = req.body.URL;

    await adHocController.adHocCacheRefresh(objectId, payload);


    res.json({ message: 'Ad-hoc cache refresh completed successfully.' });
  } catch (err) {
    logger.error(`Error in adHocCacheRefresh: ${ err.message, err.stack }`);

    res.status(500).json({ error: 'An error occurred during ad-hoc cache refresh.' });
  }
});

module.exports = router;
