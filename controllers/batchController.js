const CachedObject = require('../models/cachedObject');
const logger = require('../logger');

exports.batchCacheRefresh = async (req, res) => {
  try {
    const { criteria } = req.body;

    logger.info('Batch cache refresh request received with criteria: ${criteria}');
    await simulateTimeConsumingTask();


    const cachedObjectsToUpdate = await CachedObject.find(criteria);

    for (const cachedObject of cachedObjectsToUpdate) {
      logger.info(`Starting cache refresh for object ID: ${cachedObject.ID}`);

      await simulateTimeConsumingTask();

      logger.info(`Cache refresh completed for object ID: ${cachedObject.ID}`);

      cachedObject.lastUpdateDate = new Date();
      cachedObject.cachedData = 'Sample updated cached data'; 
      cachedObject.requestType = 'batch';

      await cachedObject.save();
    }

    logger.info('Batch cache refresh completed.');

    res.json({ message: 'Batch cache refresh completed successfully.' });
  } catch (err) {
    logger.error(`Error in batchCacheRefresh: ${err}`);

    res.status(500).json({ error: 'An error occurred during batch cache refresh.' });
  }
};

const simulateTimeConsumingTask = () => {
  return new Promise((resolve) => {
    logger.info('Simulating time-consuming batch cache refresh task...');
    setTimeout(resolve, 3000); 
  });
};
