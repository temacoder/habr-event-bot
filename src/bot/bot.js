var TelegramBot = require('node-telegram-bot-api');
var BotUtils = require('./utils');
var Logger = require('../utils/logger');
var CalendarHandler = require('./handlers/calendar-handler');
var StartHandler = require('./handlers/start-handler');
var VoteHandler = require('./handlers/vote-handler');
var fs = require('fs');

var Bot = {
    configure: function (telegramToken) {
        Logger.notify('Configuring the bot ');

        this.telegramBot = new TelegramBot(telegramToken, { polling: true });

        var buttonsJson = JSON.parse(fs.readFileSync('./src/buttons.json', 'utf8'));

        var buttons = [];
        buttons.push(BotUtils.buildDefaultButton(buttonsJson.calendar, 'calendar'));
        buttons.push(BotUtils.buildShareButton(buttonsJson.shareText, buttonsJson.shareUrl));
        buttons.push(BotUtils.buildUrlButton(buttonsJson.linkText, buttonsJson.linkUrl));

        this.messageOptions = BotUtils.buildMessageOptions(buttons);

        CalendarHandler.register(this.telegramBot, this.messageOptions);
        StartHandler.register(this.telegramBot, this.messageOptions);
        VoteHandler.register(this.telegramBot, this.messageOptions);
    }
};

module.exports = Bot;