require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');
const logger = require('./config/logger');


const adHocConsumer = require('./queue/adHocConsumer.js');
const batchConsumer = require('./queue/batchConsumer.js');
mongoose.connect(process.env.MONGO_URL
  , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB locally'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const app = express();
(async () => {
  try {
    await adHocConsumer.start();
    await batchConsumer.start();
    logger.info('Consumers started successfully.');
  } catch (error) {
    logger.error('Error starting consumers:', error);
  }
})();

app.use(bodyParser.json());
app.use('/api', routes);

app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

const PORT = 3000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
