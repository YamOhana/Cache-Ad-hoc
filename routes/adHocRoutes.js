const express = require('express');
const adHocController = require('../controllers/adHocController');
const logger = require('../logger');

const router = express.Router();

router.post('/refresh/:objectId', async (req, res) => {
  try {
    const { objectId } = req.params;

    logger.info(`Ad-hoc cache refresh request received for object ID: ${ objectId }` );

    await adHocController.adHocCacheRefresh(objectId);

    logger.info(`Ad-hoc cache refresh completed for object ID: ${ objectId }` );

    res.json({ message: 'Ad-hoc cache refresh completed successfully.' });
  } catch (err) {
    logger.error(`Error in adHocCacheRefresh: ${ err.message, err.stack }`);

    res.status(500).json({ error: 'An error occurred during ad-hoc cache refresh.' });
  }
});

module.exports = router;
