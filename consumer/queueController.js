require('dotenv').config();
const amqp = require('amqplib');
const CachedObject = require('../models/cachedObject');
const logger = require('../logger');

const rabbitmqUrl = process.env.RABBITMQ_URL;
const exchangeName = 'cache_refresh_exchange';
const adHocQueueName = 'adhoc_cache_refresh_queue';
const batchQueueName = 'batch_cache_refresh_queue';

const consumeMessages = async () => {
  try {
    const connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, 'direct', { durable: true });
    await channel.assertQueue(adHocQueueName, { durable: true });
    await channel.assertQueue(batchQueueName, { durable: true });

    await channel.bindQueue(adHocQueueName, exchangeName, 'adHoc');
    await channel.bindQueue(batchQueueName, exchangeName, 'batch');

    channel.consume(adHocQueueName, (message) => {
      if (message) {
        const objectId = message.content.toString();
        handleAdHocCacheRefresh(objectId);
        channel.ack(message);
      }
    });

    channel.consume(batchQueueName, (message) => {
      if (message) {
        const criteria = JSON.parse(message.content.toString());
        handleBatchCacheRefresh(criteria);
        channel.ack(message);
      }
    });

    logger.info('RabbitMQ consumer started and waiting for messages...');
  } catch (error) {
    logger.error('Error in RabbitMQ consumer:', error);
  }
};

const handleAdHocCacheRefresh = async (objectId) => {
  try {
    logger.info(`Handling ad-hoc cache refresh for object ID: ${objectId}`);

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

const handleBatchCacheRefresh = async (criteria) => {
  try {
    logger.info('Handling batch cache refresh with criteria:', criteria);

    const cachedObjectsToUpdate = await CachedObject.find(criteria);
    for (const cachedObject of cachedObjectsToUpdate) {
      await cachedObject.updateOne({
        cachedData: 'Sample updated cached data',
        requestType: 'batch',
        lastUpdateDate: new Date(),
      });
    }

    logger.info('Batch cache refresh completed.');
  } catch (error) {
    logger.error('Error in batch cache refresh:', error);
  }
};

module.exports = consumeMessages;
