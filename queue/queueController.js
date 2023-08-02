const setupRabbitMQ = require('../config/rabbitmqConfig');
const logger = require('../config/logger')

let channel;

const initializeChannel = async () => {
  if (!channel) {
    logger.info('innitiating channel');
    const { connection, channel: initializedChannel } = await setupRabbitMQ();
    channel = initializedChannel;
    connection.on('close', () => {
      logger.error('RabbitMQ connection closed.');
      channel = null;
    });
  }
};

exports.sendMessage = async (queueType, message, payload) => {
  try {
    await initializeChannel();

    if (queueType === 'adHoc') {
      logger.info('Publishing message to ad-hoc channel');
      const adHocExchangeName = 'adHocExchange';
      const adHocRoutingKey = 'adHocExchange';
      const adHocMessage = { message, payload };
      const adHocMessageBuffer = Buffer.from(JSON.stringify(adHocMessage));
      await channel.publish(adHocExchangeName, adHocRoutingKey, adHocMessageBuffer, { persistent: true });
      logger.info('Message sent to ad-hoc exchange with routing key "adHoc"');

    } else if (queueType === 'batch') {
      logger.info('Publishing message to batch requests queue');
      const batchQueueName = 'batchQueue';
      const batchQueueMessage = { message, payload };
      const batchMessageBuffer = Buffer.from(JSON.stringify(batchQueueMessage));
      await channel.sendToQueue(batchQueueName, batchMessageBuffer, { persistent: true });
      logger.info('Message sent to batch queue');
    } else {
      logger.error(`Invalid queue type: ${queueType}`);
    }
  } catch (error) {
    logger.error(`Error sending message to RabbitMQ: ${error}`);
  }
};
