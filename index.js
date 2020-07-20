const { App } = require('@slack/bolt');
const store = require('./store');
const okta_connect = require('./okta_connector')
const helper = require('./helper');
const bodyParser = require('body-parser')
const bot_token=process.env.SLACK_BOT_TOKEN
const test=1
var http = require("http");
const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN
});

//app.token="3423423"
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
      var userList = okta_connect.getUsers(store.getOktaToken(),message.channel,"list")
    }
});

app.message('token', async ({ message, say }) => {
  console.log("token is: "+app.token)
  store.setOktaToken("SSWS "+message.text.split('=')[1])
  say(`Okta Token set successfully to: ${store.getOktaToken()}`) 
});

app.message('create', async ({ message, say }) => {
  
   if(helper.tokenNotPresent()){
      say(`Please enter a valid Okta Token`) 
   }
  else
    {
      var userList = okta_connect.createUser(store.getOktaToken(),message.text,message.channel)
    }
});

app.message('query', async ({ message, say }) => {
  
   if(helper.tokenNotPresent()){
      say(`Please enter a valid Okta Token`) 
   }
  else
    {
      var userList = okta_connect.queryUsers(store.getOktaToken(),message.text,message.channel)
    }
});

app.message('update', async ({ message, say }) => {
  
   if(helper.tokenNotPresent()){
      say(`Please enter a valid Okta Token`) 
   }
  else
    {
      var userList = okta_connect.updateUser(store.getOktaToken(),message.text,message.channel)
    }
});


// Start your app
/*http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
  
  let data=[]
   request.on('data', chunk => {
    data.push(chunk.toString())
  });
  
  request.on('end', () => {
    console.log("Data: "+JSON.stringify(data)) // 'Buy the milk'
  })
}).listen(process.env.PORT || 3000)*/

(async () => {
  
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();

