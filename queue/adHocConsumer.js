const CachedObject = require('../models/cachedObject');
const logger = require('../config/logger');

const handleAdHocCacheRefresh = async (objectId) => {
    try {
        logger.info(`Handling ad-hoc cache refresh for object ID: ${objectId}`);

        // action example
        await CachedObject.findOneAndUpdate(
            { ID: objectId },
            { cachedData: 'Sample updated cached data', requestType: 'ad-hoc' },
            { upsert: true, new: true }
        );

        logger.info(`Ad-hoc cache refresh completed for object ID: ${objectId}`);
    } catch (error) {
        logger.error(`Error in ad-hoc cache refresh for object ID: ${objectId}`, error);
    }
};

module.exports = handleAdHocCacheRefresh;
