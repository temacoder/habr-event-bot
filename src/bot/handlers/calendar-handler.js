var BotUtils = require('../utils');
var MessagesService = require('../../services/messages-service');
var Logger = require('../../utils/logger');

var CalendarHandler = {
    register: function (telegramBot, messageOptions) {
        Logger.notify('Registering the calendar handler ');

        telegramBot.on('callback_query', function (message) {
            var clientId = BotUtils.getClientIdFromMessage(message);

            if(message.data === 'calendar'){
                Logger.notify('Sending message from the calendar handler ');

                MessagesService.getByTitle('calendar', function (err, message) {
                    if(err){
                        telegramBot.sendMessage(clientId, 'Some error! Sorry', messageOptions);
                    }else{
                        telegramBot.sendMessage(clientId, message.text, messageOptions);
                    }
                });
            }
        });
    }
};

module.exports = CalendarHandler;