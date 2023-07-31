const amqp = require('amqplib');
const { consumeMessages } = require('./queueController');
const logger = require('../logger');

const AD_HOC_QUEUE_NAME = 'ad_hoc_cache_refresh_queue';
const BATCH_QUEUE_NAME = 'batch_cache_refresh_queue';

async function startAdHocCacheRefreshConsumer() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        await channel.assertQueue(AD_HOC_QUEUE_NAME, { durable: true });

        consumeMessages(channel, AD_HOC_QUEUE_NAME);

        logger.info('Ad-hoc cache refresh consumer started. Waiting for messages...');
    } catch (error) {
        logger.error('Error starting the ad-hoc cache refresh consumer:', error);
    }
}

async function startBatchCacheRefreshConsumer() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        await channel.assertQueue(BATCH_QUEUE_NAME, { durable: true });

        consumeMessages(channel, BATCH_QUEUE_NAME);

        logger.info('Batch cache refresh consumer started. Waiting for messages...');
    } catch (error) {
        logger.error('Error starting the batch cache refresh consumer:', error);
    }
}

startAdHocCacheRefreshConsumer();
startBatchCacheRefreshConsumer();
