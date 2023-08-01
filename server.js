require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');
const logger = require('./config/logger');
const adHocConsumer = require('./queue/adHocConsumer.js');
const batchConsumer = require('./queue/batchConsumer.js');
const PORT = 3000;

mongoose.connect(process.env.MONGO_URL_DEV
  , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB locally'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const app = express();
const startConsumers = async () => {
  logger.info('connecting to rabbit')
  try {
    await adHocConsumer.start();
    await batchConsumer.start();
    logger.info('Consumers started successfully.');
  } catch (error) {
    logger.error('Error starting consumers:', error);
  }
}
setTimeout(startConsumers, 10000);

app.use(bodyParser.json());
app.use('/api', routes);

app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});


app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
