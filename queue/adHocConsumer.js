const amqp = require('amqplib');
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

exports.start = async () => {
  try {
    const rabbitmqUrl = process.env.RABBITMQ_URL; 
    const connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();
    const exchangeName = 'adHoc';

    await channel.assertExchange(exchangeName, 'fanout', { durable: false });
    const { queue } = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(queue, exchangeName, '');

    channel.consume(queue, async (message) => {
      console.log(message);
      if (message.content) {
        const data = JSON.parse(message.content.toString());
        await handleAdHocCacheRefresh(data.objectId);
      }
    }, { noAck: true });

    logger.info('Ad-hoc cache refresh consumer started successfully.');
  } catch (error) {
    logger.error('Error starting ad-hoc cache refresh consumer:', error);
    throw error;
  }
};
