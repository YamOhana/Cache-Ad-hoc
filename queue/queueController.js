const setupRabbitMQ = require('../config/rabbitmqConfig');

let channel;

const initializeChannel = async () => {
  if (!channel) {
    channel = await setupRabbitMQ();
  }
};

exports.sendMessage = async (queueType, message) => {
  try {
    await initializeChannel();

    if (queueType === 'adHoc') {
      const adHocExchangeName = 'adHocExchange';
      const adHocRoutingKey = 'adHoc';
      const adHocMessageBuffer = Buffer.from(JSON.stringify(message));
      await channel.publish(adHocExchangeName, adHocRoutingKey, adHocMessageBuffer, { persistent: true });
      console.log('Message sent to ad-hoc exchange with routing key "adHoc"');
    } else if (queueType === 'batch') {
      const batchQueueName = 'batchQueue';
      const batchMessageBuffer = Buffer.from(JSON.stringify(message));
      await channel.sendToQueue(batchQueueName, batchMessageBuffer, { persistent: true });
      console.log('Message sent to batch queue');
    } else {
      console.error('Invalid queue type:', queueType);
    }
  } catch (error) {
    console.error('Error sending message to RabbitMQ:', error);
  }
};
