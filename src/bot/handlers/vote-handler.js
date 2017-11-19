var BotUtils = require('../utils');
var MessagesService = require('../../services/messages-service');
var VoteService = require('../../services/vote-service');
var Logger = require('../../utils/logger');

var VoteHandler = {
    register: function (telegramBot, messageOptions) {
        Logger.notify('Registering the vote handler ');

        telegramBot.on('callback_query', function (message) {
            var clientInfo = BotUtils.getClientInfo(message);
            var lastMessageText = BotUtils.getLastMessageText(message);

            if(message.data === 'yes' || message.data === 'no'){
                Logger.notify('Sending message from the vote handler ');

                var voteInfo = {
                    telegramId: clientInfo.telegramId,
                    question: lastMessageText,
                    answer: message.data,
                    time: Date.now().toString()
                };

                VoteService.saveVote(voteInfo, function (saveErr, result) {
                    if (saveErr) {
                        telegramBot.sendMessage(clientInfo.telegramId, 'Some error! Sorry', messageOptions);
                        return;
                    }
                    MessagesService.getByTitle('thanks', function (err, message) {
                        if(err){
                            telegramBot.sendMessage(clientInfo.telegramId, 'Some error! Sorry', messageOptions);
                        }else{
                            telegramBot.sendMessage(clientInfo.telegramId, message.text, messageOptions);
                        }
                    });
                });
            }
        });
    }
};

module.exports = VoteHandler;