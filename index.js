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
    }else if (config.jenkins_method == 'POST') {
      option = {
        method: 'POST',
        uri: config.jenkins_url + 'job/' + cmd[2] + '/build?token=' + config.jenkins_token
      };
    }
    winston.info('option:' + JSON.stringify(option));
    request(option, function(err, res, body){
      winston.info('res:' + JSON.stringify(res));
      winston.info('body:' + body);
      if (!err && (res.statusCode == 200 || res.statusCode == 201 )) {
        bot.postMessageToChannel('general', 'yes, sir', params);
      }else{
        winston.info('res:' + JSON.stringify(res) + '\nbody:' + body);
        bot.postMessageToChannel('general', 'jenkins take time off', params);
      }
    });
  }
};
