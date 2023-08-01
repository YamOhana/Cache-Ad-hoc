const logger = require('../config/logger');
const queueController = require('../queue/queueController');
const simulateTimeConsumingTask = require('../utils/simulateTimeConsumingTask');

exports.batchCacheRefresh = async (req, res) => {
  try {
    const { criteria } = req.body;
    logger.info(`Batch cache refresh request received with criteria: ${JSON.stringify(criteria)}`);
    await queueController.sendMessage('batch', criteria);
    await simulateTimeConsumingTask();
    res.json({ message: 'Batch cache refresh completed successfully.' });
  } catch (err) {
    logger.error(`Error in batchCacheRefresh: ${err}`);
    res.status(500).json({ error: 'An error occurred during batch cache refresh.' });
  }
};
