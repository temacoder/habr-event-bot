var nodeLogger = require('simple-node-logger');

var Logger = {
    logger: nodeLogger.createSimpleLogger('logfile.log'),
    notify: function (data) {
        this.logger.info(data, new Date().toJSON());
    }
};

module.exports = Logger;