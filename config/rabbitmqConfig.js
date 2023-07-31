const amqp = require('amqplib');
const rabbitmqUrl = process.env.RABBITMQ_URL;
const logger = require('./logger')


const setupRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(rabbitmqUrl);
        logger.info('Connecting to rabbit')
        const channel = await connection.createChannel();

        logger.info('Declair exchange');

        const adHocExchangeName = 'adHocExchange';
        await channel.assertExchange(adHocExchangeName, 'direct', { durable: true });

        logger.info('Declair addhoc queue');

        const adHocQueueName = 'adHocQueue';
        await channel.assertQueue(adHocQueueName, { durable: true });
        await channel.bindQueue(adHocQueueName, adHocExchangeName, 'adHoc');

        logger.info('Declair batchQueue');

        const batchQueueName = 'batchQueue';
        await channel.assertQueue(batchQueueName, { durable: true });
        return channel;
    } catch (error) {
        console.error('Error setting up RabbitMQ:', error);
    }
};

module.exports = setupRabbitMQ;
