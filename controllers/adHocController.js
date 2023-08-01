const logger = require('../config/logger');
const simulateTimeConsumingTask = require('../utils/simulateTimeConsumingTask');
const queueController = require('../queue/queueController');

exports.adHocCacheRefresh = async (objectId, payload) => {
  try {
    logger.info(`ADHOC CONTROLLER: Ad-hoc cache refresh request received for object ID: ${objectId}`);
    await queueController.sendMessage('adHoc', objectId, payload);
    await simulateTimeConsumingTask();
    logger.info(`ADHOC CONTROLLER: Cache refresh completed for object ID: ${objectId}`);
  } catch (err) {
    logger.error(`Error in adHocCacheRefresh: ${err}`);
    
  }
};
