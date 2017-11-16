var MessageModel = require('../models/message-model');
var Logger = require('../utils/logger');

var MessagesService = {
    getByTitle: function (title, callback) {
        Logger.notify('Called MessagesService.getByTitle with title: ' + title + ' ');

        MessageModel.findOne({title: title}, function (err, message) {
            if (err) {
                callback(err, null);
            }
            else {
                callback(null, message);
            }
        });
    }
};

module.exports = MessagesService;