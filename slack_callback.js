const { App } = require("@slack/bolt");
const oktaTokenConst = "oktaToken";
const botTokenConst = "botToken";
const signedSecretConst = "signedSecret";



exports.postMessageBack = async (text, back_channel, auth) => {
  try {
    const slackApp = new App({
      signingSecret: auth[signedSecretConst],
      token: auth[botTokenConst]
    });

    const result = await slackApp.client.chat.postMessage({
      token: auth[botTokenConst],
      channel: back_channel,
      text: text
    });
  } catch (e) {
    console.log(e);
  }
};
