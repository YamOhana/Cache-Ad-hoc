const logger = require('../config/logger');


const simulateTimeConsumingTask = () => {
    return new Promise((resolve) => {
      logger.info('Simulating time-consuming cache refresh task...');
      setTimeout(resolve, 3000);
    });
  };

  
  module.exports = simulateTimeConsumingTask;
