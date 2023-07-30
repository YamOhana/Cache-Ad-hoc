const CachedObject = require('../models/cachedObject');
const logger = require('../logger'); 

exports.adHocCacheRefresh = async (req, res) => {
  try {
    const { objectId } = req.params;

    logger.info('Ad-hoc cache refresh request received for object ID:', objectId);

    logger.info('Starting cache refresh for object ID:', objectId);

    await simulateTimeConsumingTask();

    logger.info('Cache refresh completed for object ID:', objectId);

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

    logger.info('Cached object updated in the database:', cachedObject);

    return res.status(200).json({ success: true, cachedObject });
  } catch (err) {
    logger.error('Error in adHocCacheRefresh:', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const simulateTimeConsumingTask = () => {
  return new Promise((resolve) => {
    logger.info('Simulating time-consuming cache refresh task...');
    setTimeout(resolve, 3000); 
  });
};
