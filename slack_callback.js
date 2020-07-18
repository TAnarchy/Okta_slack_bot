const { App } = require('@slack/bolt');
const bot_token=process.env.SLACK_BOT_TOKEN
const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN
});


exports.postMessageTestWithText= async (text,back_channel)=>{
try{
     const result = await app.client.chat.postMessage({
      token: bot_token,
      channel: back_channel,
      text: text
     })
     }
  catch(e){
    console.log(e)
  }
}
