var Botkit = require('botkit')

var token = process.env.SLACK_TOKEN

var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
})

// Assume single team mode if we have a SLACK_TOKEN
if (token) {
  console.log('Starting in single-team mode')
  controller.spawn({
    token: token,
    retry: Infinity
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })
// Otherwise assume multi-team mode - setup beep boop resourcer connection
} else {
  console.log('Starting in Beep Boop multi-team mode')
  require('beepboop-botkit').start(controller, { debug: true })
}

// controller.on('bot_channel_join', function (bot, message) {
//   bot.reply(message, "I'm here!")
// })

// Main functionality

// Quote functionality
controller.hears(['inspire', 'inspire me', 'quote'], ['direct_mention'], pickQuote)

controller.hears(['inspire', 'inspire me', 'quote'], ['direct_message'], pickQuote)


// Say hi!
controller.hears(['hello', 'hi'], ['direct_mention'], function (bot, message) {
  bot.reply(message, 'What\s up.')
})

controller.hears(['hello', 'hi'], ['direct_message'], function (bot, message) {
  bot.reply(message, 'Hello.')
  bot.reply(message, 'It\'s nice to talk to you directly.')
})

// Else
controller.hears('.*', ['mention'], function (bot, message) {
  bot.reply(message, 'You really do care about me. :heart:')
})

// controller.hears('help', ['direct_message', 'direct_mention'], function (bot, message) {
//   var help = 'I will respond to the following messages: \n' +
//       '`bot hi` for a simple message.\n' +
//       '`bot attachment` to see a Slack attachment message.\n' +
//       '`@<your bot\'s name>` to demonstrate detecting a mention.\n' +
//       '`bot help` to see this again.'
//   bot.reply(message, help)
// })

controller.hears('.*', ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand. \n')
})


var quotes = [
  {
    quote: 'Failure is an option here. If things are not failing, you are not innovating enough.', 
    person: 'Elon Musk'
  },
  {
    quote: 'If something is important enough, even if the odds are against you, you should still do it.', 
    person: 'Elon Musk'
  },
  {
    quote: 'Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.',
    person: 'Lao Tzu'
  },
  {
    quote: 'The journey of a thousand miles begins with a single step.',
    person: 'Lao Tzu'
  },
  {
    quote: 'When I let go of what I am, I become what I might be.',
    person: 'Lao Tzu'
  }
]


function pickQuote(bot, message) {
  var quote = quotes[Math.floor(Math.random() * quotes.length)]
  var response = `>"${quote.quote}" \n- ${quote.person}`
  bot.reply(message, response)
}





