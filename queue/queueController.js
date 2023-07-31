const amqp = require('amqplib');
const logger = require('../config/logger');

const rabbitmqUrl = process.env.RABBITMQ_URL;
const exchangeName = 'cache_refresh_exchange';
const adHocQueueName = 'adhoc_cache_refresh_queue';
const batchQueueName = 'batch_cache_refresh_queue';

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, 'direct', { durable: true });
    await channel.assertQueue(adHocQueueName, { durable: true });
    await channel.assertQueue(batchQueueName, { durable: true });

    await channel.bindQueue(adHocQueueName, exchangeName, 'adHoc');
    await channel.bindQueue(batchQueueName, exchangeName, 'batch');

    return channel;
  } catch (error) {
    logger.error('Error connecting to RabbitMQ:', error);
    throw error;
  }
};

const sendMessage = async (queueType, message) => {
  try {
    const channel = await connectRabbitMQ();
    const queueName = queueType === 'adHoc' ? adHocQueueName : batchQueueName;
    const messageBuffer = Buffer.from(JSON.stringify(message));

    channel.sendToQueue(queueName, messageBuffer, { persistent: true });

    logger.info(`Message sent to RabbitMQ ${queueType} queue:`, message);
  } catch (error) {
    logger.error(`Error sending message to RabbitMQ ${queueType} queue:`, error);
    throw error;
  }
};

module.exports = { sendMessage };
