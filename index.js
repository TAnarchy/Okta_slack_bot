const { App } = require('@slack/bolt');
const store = require('./store');
const okta_connect = require('./okta_connector')
const helper = require('./helper');
const bot_token=process.env.SLACK_BOT_TOKEN
const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN
});


app.event('app_home_opened', ({ event, say }) => {  
  // Look up the user from DB

  
  if (helper.tokenNotPresent()){
    say(`Please enter a valid Okta Token`)
  }
});


app.message('knock knock', async ({ message, say }) => {
  say(`Back at ya ${message.text}`);
});

app.message('list', async ({ message, say }) => {
  
   if(helper.tokenNotPresent()){
      say(`Please enter a valid Okta Token`) 
   }
  else
    {
    /*  var userList = okta_connect.getUsers_sync(store.getOktaToken())
      say(`${userList}`);*/
      var userList = okta_connect.getUsers(store.getOktaToken())
    }
});

app.message('token', async ({ message, say }) => {
  store.setOktaToken("SSWS "+message.text.split('=')[1])
  say(`Okta Token set successfully to: ${store.getOktaToken()}`) 
});

app.message('special', async ({ message, say }) => {
  say(`user is: ${message.user} and channel is: ${message.channel}`)
  okta_connect.goBackTest()
});



// Start your app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();

