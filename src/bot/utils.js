var BotUtils = {
    getClientIdFromMessage: function (message) {
        return message.hasOwnProperty('chat') ? message.chat.id : message.from.id;
    },

    buildDefaultButton : function (text, callback_data) {
        return [{
            text: text,
            callback_data: callback_data
        }]
    },

    buildUrlButton : function (text, url) {
        return [{
            text: text,
            url: url
        }]
    },

    buildShareButton: function (text, shareUrl) {
        return [{
            text: text,
            url: 'https://telegram.me/share/url?url=' + shareUrl
        }]
    },

    buildMessageOptions: function (buttons) {
        return {
            parse_mode: "HTML",
            disable_web_page_preview: false,
            reply_markup : JSON.stringify({
                inline_keyboard: buttons
            })
        }
    }
};

module.exports = BotUtils;