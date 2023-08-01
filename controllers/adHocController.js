const logger = require('../config/logger');
const simulateTimeConsumingTask = require('../utils/simulateTimeConsumingTask');
const queueController = require('../queue/queueController');

exports.adHocCacheRefresh = async (objectId, payload) => {
  try {
    logger.info(`Ad-hoc cache refresh request received for object ID: ${objectId}`);
    await queueController.sendMessage('adHoc', objectId, payload);
    await simulateTimeConsumingTask();
  } catch (err) {
    logger.error(`Error in adHocCacheRefresh: ${err}`);
    
  }
};
