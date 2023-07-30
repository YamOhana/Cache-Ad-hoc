require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');
const logger = require('./logger');

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  logger.info('Connected to MongoDB');
});

const app = express();

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