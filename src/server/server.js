var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var Logger = require('../utils/logger');
var UserService = require('../services/user-service');

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

        this.app.listen(process.env.PORT || 5000, function () {
            Logger.notify('Server started at 5000 ');
        });
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

        UserService.getAll(function (err, users) {
            if (err) {
                Logger.notify('Some error!' + err.message);
                return;
            }
            response.render('main', {users: users});
        });
    }
};

module.exports = Server;

