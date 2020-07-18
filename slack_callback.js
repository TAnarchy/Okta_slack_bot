const { App } = require('@slack/bolt');
const bot_token=process.env.SLACK_BOT_TOKEN
const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN
});

exports.postMessageTest= async ()=>{
try{
     const result = await app.client.chat.postMessage({
      token: bot_token,
      channel: 'D017PG3NAKT',
      text: `Post back successful`
     })
     }
  catch(e){
    console.log(e)
  }
}

exports.postMessageTestWithText= async (text)=>{
try{
     const result = await app.client.chat.postMessage({
      token: bot_token,
      channel: 'D017PG3NAKT',
      text: text
     })
     }
  catch(e){
    console.log(e)
  }
}
