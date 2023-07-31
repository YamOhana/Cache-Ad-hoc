const logger = require('../config/logger');
const simulateTimeConsumingTask = require('../utils/simulateTimeConsumingTask');
const queueController = require('../queue/queueController');

exports.adHocCacheRefresh = async (objectId) => {
  try {
    
    logger.info(`Ad-hoc cache refresh request received for object ID: ${objectId}`);

    await queueController.sendMessage('adHoc', { objectId });

    await simulateTimeConsumingTask();

    logger.info(`Cache refresh completed for object ID: ${objectId}`);
    res.json({ message: 'Cache refreshed successfully' });
  } catch (err) {
    logger.error(`Error in adHocCacheRefresh: ${err}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
