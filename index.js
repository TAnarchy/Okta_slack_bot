const { App } = require('@slack/bolt');
const store = require('./store');
const okta_connect = require('./okta_connector')
const helper = require('./helper');
const bot_token=process.env.SLACK_BOT_TOKEN
const http = require('http')
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
      var userList = okta_connect.getUsers(store.getOktaToken(),message.channel,"list")
    }
});

app.message('token', async ({ message, say }) => {
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

exports.processData = (input_data,back_channel) =>{
  var command = input_data.split(" ")[0]
  var value = input_data.split(" ")[1]
  console.log("input data "+input_data.split(" ")[0])
  if (command =="token")
    {
      value=value.split(",")
      store.setOktaToken("SSWS "+value[0])
      store.setBotToken(value[1])
      store.setSlackSecret(value[2])
      console.log("Token set: "+value[0])
    }
  else if (command=="list")
    {
      console.log("Channel is: "+back_channel)
      var userList = okta_connect.getUsers(store.getOktaToken(),back_channel,"list")
    }
  else if (command=="create")
    {
      console.log("creating")
      var userList = okta_connect.createUser(store.getOktaToken(),input_data,back_channel)
    }
}

(async () => {
  
  http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end();
  
  let data=[]
   request.on('data', chunk => {
    data.push(chunk.toString())
  });
  
  request.on('end', () => {
   try{
     var text=JSON.parse(data[0]).event.text
     var channel=JSON.parse(data[0]).event.channel
    console.log("text sent: "+data[0])
     exports.processData(text,channel)
     
   } catch(e)
   {//console.log("Request failed")
   
   }
  })
}).listen(process.env.PORT || 3000)
  
  
  /*await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');*/
})();

