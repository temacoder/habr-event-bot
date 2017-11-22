var VoteModel = require('../models/vote-model');
var Logger = require('../utils/logger');

var VoteService = {
    getAll: function (callback) {
        Logger.notify('Called UserService.getAll ');

        VoteModel.find({}, function (err, votes) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, votes);
            }
        })
    },

    isNew: function (telegramId, question, callback) {
        Logger.notify('Called VoteService.isNew ');

        VoteModel.findOne({telegramId: telegramId, question: question}, function (err, existingVote) {
            if (err) {
                callback(err, null);
                return;
            }
            if (existingVote) {
                callback(null, false);
            } else {
                callback(null, true);
            }
        });
    },

    saveVote: function (voteInfo, callback) {
        Logger.notify('Called VoteService.saveVote with question: ('
            + voteInfo.question + ') for user: '
            + voteInfo.telegramId);

        this.isNew(voteInfo.telegramId, voteInfo.question, function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            if (result) {
                var newVoteDto = new VoteModel({
                    telegramId: voteInfo.telegramId,
                    question: voteInfo.question,
                    answer: voteInfo.answer,
                    time: voteInfo.time
                });
                Logger.notify('Trying to save new vote ');
                
                newVoteDto.save(function (err) {
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

module.exports = VoteService;
