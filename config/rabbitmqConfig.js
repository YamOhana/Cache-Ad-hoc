const amqp = require('amqplib');
const logger = require('./logger')


const setupRabbitMQ = async () => {
    try {
        logger.info('Connecting to RabbitMQ');
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();

        logger.info('Declair ad-hoc pub/sub exchange channel');

        const adHocExchangeName = 'adHocExchange';
        await channel.assertExchange(adHocExchangeName, 'direct', { durable: true });

        logger.info('Declair addhoc queue by sub');

        const adHocQueueName = 'adHocQueue';
        await channel.assertQueue(adHocQueueName, { durable: true });
        await channel.bindQueue(adHocQueueName, adHocExchangeName, 'adHocExchange');

        logger.info('Declair batch requests Queue');

        const batchQueueName = 'batchQueue';
        await channel.assertQueue(batchQueueName, { durable: true });
        return { connection, channel };
    } catch (error) {
        logger.error(`Error setting up RabbitMQ: ${error}`);
        throw error;
    }
};

module.exports = setupRabbitMQ;
