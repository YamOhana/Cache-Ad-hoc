const amqp = require('amqplib');
const CachedObject = require('../models/cachedObject');
const logger = require('../config/logger');

const handleAdHocCacheRefresh = async (message, payload) => {
  try {
    logger.info(`Handling ad-hoc cache refresh for object ID: ${message}`);

    // action example
    await CachedObject.findOneAndUpdate(
      { ID: message },
      { cachedData: payload, requestType: 'ad-hoc' },
      { upsert: true, new: true }
    );

    logger.info(`Ad-hoc cache refresh completed for object ID: ${message}`);
  } catch (error) {
    logger.error(`Error in ad-hoc cache refresh for object ID: ${message}`, error);
  }
};

exports.start = async () => {
  try {
    const rabbitmqUrl = process.env.RABBITMQ_URL_DEV; 
    const connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();
    const exchangeName = 'adHocExchange';

    await channel.assertExchange(exchangeName, 'direct', { durable: true });
    const { queue } = await channel.assertQueue('adHocQueue');
    await channel.bindQueue(queue, exchangeName, '');


    channel.consume(queue, async (message) => {
      if (message.content) {
        const data = JSON.parse(message.content.toString());
        console.log(data);
        await handleAdHocCacheRefresh(data.message, data.payload);
      }
    }, { noAck: true });

    logger.info('Ad-hoc cache refresh consumer started successfully.');
  } catch (error) {
    logger.error('Error starting ad-hoc cache refresh consumer:', error);
    throw error;
  }
};
