require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
// const adHocRoutes = require('./routes/adHocRoutes');
// const batchRoutes = require('./routes/batchRoutes');
// const adHocController = require('./controllers/adHocController');
// const batchController = require('./controllers/batchController');

const app = express();
const port = 3000;

// Connect to MongoDB Atlas
console.log(`connecting to ${process.env.MONGO_URL}`);
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// app.use('/', adHocRoutes);
// app.use('/', batchRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
