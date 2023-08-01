const amqp = require('amqplib');
const CachedObject = require('../models/cachedObject');
const logger = require('../config/logger');

const handleBatchCacheRefresh = async (criteria) => {
  try {
    logger.info('Handling batch cache refresh with criteria:', criteria);

    // Perform your batch cache refresh logic here...
    // action example
    const updatedData = 'Sample updated cached data for batch';
    await CachedObject.updateMany(criteria, { cachedData: updatedData, requestType: 'batch' });

    logger.info('Batch cache refresh completed with criteria:', criteria);
  } catch (error) {
    logger.error('Error in batch cache refresh:', error);
  }
};

exports.start = async () => {
  try {
    const rabbitmqUrl = process.env.RABBITMQ_URL; 
    const connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();
    const exchangeName = 'batch';

    await channel.assertExchange(exchangeName, 'fanout', { durable: false });
    const { queue } = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(queue, exchangeName, '');

    channel.consume(queue, async (message) => {
      if (message.content) {
        const data = JSON.parse(message.content.toString());
        await handleBatchCacheRefresh(data.criteria);
      }
    }, { noAck: true });

    logger.info('Batch cache refresh consumer started successfully.');
  } catch (error) {
    logger.error('Error starting batch cache refresh consumer:', error);
    throw error;
  }
};
