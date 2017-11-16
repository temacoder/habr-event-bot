var BotUtils = require('../utils');
var MessagesService = require('../../services/messages-service');
var UserService = require('../../services/user-service');
var Logger = require('../../utils/logger');

var StartHandler = {
    register: function (telegramBot, messageOptions) {
        Logger.notify('Registering the default handler ');

        var clientMessage = new RegExp('\/start');

        telegramBot.onText(clientMessage, function (message, match) {
            Logger.notify('Sending message from the default handler ');

            var clientId = BotUtils.getClientIdFromMessage(message);

            UserService.saveUser(clientId, function (saveErr, result) {
                if (saveErr) {
                    telegramBot.sendMessage(clientId, 'Some error! Sorry', messageOptions);
                    return;
                }

                MessagesService.getByTitle('start', function (getErr, message) {
                    if (getErr) {
                        telegramBot.sendMessage(clientId, 'Some error! Sorry', messageOptions);
                    } else {
                        telegramBot.sendMessage(clientId, message.text, messageOptions);
                    }
                });
            });
        });
    }
};

module.exports = StartHandler;