var UserModel = require('../models/user-model');
var Logger = require('../utils/logger');

var UserService = {
    getAll: function (callback) {
        Logger.notify('Called UserService.getAll ');

        UserModel.find({}, function (err, users) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, users);
            }
        })
    },

    isNew: function (telegramId, callback) {
        Logger.notify('Called UserService.isNew ');

        UserModel.findOne({telegramId: telegramId}, function (err, existingUser) {
            if (err) {
                callback(err, null);
                return;
            }
            if (existingUser) {
                callback(null, false);
            } else {
                callback(null, true);
            }
        });
    },

    saveUser: function (telegramId, callback) {
        Logger.notify('Called UserService.saveUser with id: ' + telegramId + ' ');

        this.isNew(telegramId, function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            if (result) {
                var newUserDto = new UserModel({
                    telegramId: telegramId
                });

                Logger.notify('Trying to save new user ');
                newUserDto.save(function (err) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, true);
                    }
                });
            }else{
                callback(null, false);
            }
        })
    }
};

module.exports = UserService;