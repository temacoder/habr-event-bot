var mongoose = require('mongoose');
var ConfigBuilder = require('./utils/config-builder');
var Server = require('./server/server');
var Bot = require('./bot/bot');

var config = ConfigBuilder.build();

mongoose.connect(config.connectionString, { useMongoClient: true });

Bot.configure(config.telegramToken);

Server.configure(Bot.telegramBot);


