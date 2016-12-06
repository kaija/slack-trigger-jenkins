var SlackBot = require('slackbots');
var config = require('./config.json');
var winston = require('winston');
var request = require('request');
var bot = new SlackBot({
    token: config.slack_token, // Add a bot https://my.slack.com/services/new/bot and put the token  
    name: config.slack_name
});

bot.on('start', function() {
  var params = {
    icon_emoji: ':' + config.slack_emoji + ':'
  };
  //bot.postMessageToChannel('general', 'yes, sir', params);
});

bot.on('message', function(data) {
  var params = {
    icon_emoji: ':' + config.slack_emoji + ':'
  };
  winston.debug(data);
  if ( data.type == 'message' ) {
    var cmd = data.text.split(" ");
    if (cmd[0] == 'jenkins' && cmd.length > 2) {
      jenkins(cmd);
    }
  }
});

var jenkins = function(cmd) {
  var params = {
    icon_emoji: ':' + config.slack_emoji + ':'
  };
  if (cmd[1] == 'build') {
    winston.info('command:' + cmd[2]);
    if (config.jenkins_method == 'GET') {
      option = {
        method: 'GET',
        uri: config.jenkins_url + config.jenkins_path,
        qs: {
          job: cmd[2],
          token: config.jenkins_token
        }
      };
    }
    winston.info('option:' + option);
    request(option, function(err, res, body){
      if (!err && res.statusCode == 200) {
        winston.info(body);
        bot.postMessageToChannel('general', 'yes, sir', params);
      }else{
        winston.info('code:' + res.statusCode);
        winston.info('body:' + body);
        bot.postMessageToChannel('general', 'jenkins take time off', params);
      }
    });
  }
};
