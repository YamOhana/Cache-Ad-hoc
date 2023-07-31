const CachedObject = require('../models/cachedObject');
const logger = require('../config/logger');

const handleBatchCacheRefresh = async (criteria) => {
    try {
        logger.info('Handling batch cache refresh with criteria:', criteria);

        const cachedObjectsToUpdate = await CachedObject.find(criteria);

        for (const cachedObject of cachedObjectsToUpdate) {
            logger.info('Starting cache refresh for object ID:', cachedObject.ID);

            // action example
            await cachedObject.updateOne({
                cachedData: 'Sample updated cached data',
                requestType: 'batch',
                lastUpdateDate: new Date(),
            });

            logger.info('Cache refresh request sent for object ID:', cachedObject.ID);
        }

        logger.info('Batch cache refresh completed.');
    } catch (error) {
        logger.error('Error in batch cache refresh:', error);
    }
};

module.exports = handleBatchCacheRefresh;
