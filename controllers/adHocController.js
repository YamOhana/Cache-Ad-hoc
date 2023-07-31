const CachedObject = require('../models/cachedObject');
const logger = require('../logger');
const simulateTimeConsumingTask = require('../utils');
const queue = require('./queue/queue');



exports.adHocCacheRefresh = async (objectId) => {
  try {
    logger.info(`Ad-hoc cache refresh request received for object ID: ${objectId}`);
    logger.info(`Starting cache refresh for object ID: ${objectId}`);
    await queue.sendCacheRefreshMessage(objectId);
    await simulateTimeConsumingTask();
    logger.info(`Cache refresh completed for object ID: ${objectId}`);
    const cachedObject = await CachedObject.findOneAndUpdate(
      { ID: objectId },
      {
        ID: objectId,
        URL: 'https://example.com/some-resource',
        creationDate: new Date(),
        lastUpdateDate: new Date(),
        cachedData: 'Sample cached data',
        requestType: 'ad-hoc',
      },
      { upsert: true, new: true }
    );

    logger.info(`Cached object updated in the database: ${cachedObject}`,);
    return cachedObject;
  } catch (err) {
    logger.error(`Error in adHocCacheRefresh: ${err}`,);
    throw err;
  }
};
