var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var Logger = require('../utils/logger');
var UserService = require('../services/user-service');
var VoteService = require('../services/vote-service');
var BotUtils = require('../bot/utils');

var Server = {
    configure: function (telegramBot) {
        this.telegramBot = telegramBot;

        this.app = express();
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.set('views', path.join(__dirname, './views'));
        this.app.set('view engine', 'ejs');

        this.app.get('/', this.homeController);
        this.app.post('/globalmessage', this.globalMessageController.bind(this));
        this.app.post('/privatemessage', this.privateMessage.bind(this));
        this.app.post('/voting', this.votingController.bind(this));

        this.app.listen(process.env.PORT || 5000, function () {
            Logger.notify('Server started at 5000 ');
        });
    },

    votingController: function (request, response) {
        Logger.notify('Called voting message controller');

        var message = request.body.message;
        var telegramBot = this.telegramBot;

        UserService.getAll(function (err, users) {
            if (err) {
                Logger.notify('Some error!' + err.message);
                return;
            }
            var messageOptionsForOptions = BotUtils.buildMessageOptionsForVoting();

            users.forEach(function (user) {
                telegramBot.sendMessage(user.telegramId, message, messageOptionsForOptions);
            });
        });

        response.redirect('/');
    },

    privateMessage: function(request, response) {

        var user = request.body.user;
        var message = request.body.message;
        var telegramBot = this.telegramBot;

        telegramBot.sendMessage(user, message, {});

        response.redirect('/');
    },

    globalMessageController: function(request, response) {
        Logger.notify('Called global message controller');

        var message = request.body.message;
        var telegramBot = this.telegramBot;

        UserService.getAll(function (err, users) {
            if (err) {
                Logger.notify('Some error!' + err.message);
                return;
            }

            users.forEach(function (user) {
                telegramBot.sendMessage(user.telegramId, message, {});
            })
        });

        response.redirect('/');
    },

    homeController: function (request, response) {
        Logger.notify('Called home controller');

        UserService.getAll(function (getUsersErr, users) {
            if (getUsersErr) {
                Logger.notify('Some error!' + getUsersErr.message);
                return;
            }
            VoteService.getAll(function (getVotesErr, votes) {
                if (getVotesErr) {
                    Logger.notify('Some error!' + getVotesErr.message);
                }
                response.render('main', {users: users, votes: votes});
            });
        });
    }
};

module.exports = Server;

