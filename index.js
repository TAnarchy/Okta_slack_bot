const store = require("./store");
const oktaConnect = require("./okta_connector");
const http = require("http");
const oktaTokenConst = "oktaToken";
const botTokenConst = "botToken";
const signedSecretConst = "signedSecret";
const slackCall = require("./slack_callback");

//get Command from input
exports.getInputCommand = inputData => {
  return inputData.substr(0, 6);
};
//Process requests and call appropriate okta command
exports.processData = (inputData, backChannel) => {
  try {
    console.log("input data is" + inputData + " input data ended");
    var command = exports.getInputCommand(inputData).trim();
    var value = inputData.split(" ")[1];
    console.log("command is" + command + " command ended");
    if (command.trim() == "token") {
      value = value.split(",");
      var glToken = {};
      glToken[oktaTokenConst] = "SSWS " + value[0];
      glToken[botTokenConst] = value[1];
      glToken[signedSecretConst] = value[2];
      console.log("Global token to be created is: " + JSON.stringify(glToken));
      store.setGlobalToken(glToken);
      console.log(
        "Global token saved isis: " + JSON.stringify(store.getGlobalToken())
      );
      console.log("In token");
      store.setOktaToken("SSWS " + value[0]);
      store.setBotToken(value[1]);
      store.setSlackSecret(value[2]);
      console.log("Token set: " + value[0]);
      var returnValue = "Tokens set successfully";
      slackCall.postMessageBack(
        returnValue,
        backChannel,
        store.getGlobalToken()
      );
    } else if (command == "list") {
      console.log("Channel is: " + backChannel);
      var userList = oktaConnect.getUsers(
        store.getGlobalToken(),
        backChannel,
        "list"
      );
    } else if (command == "create") {
      console.log("creating");
      var userList = oktaConnect.createUser(
        store.getGlobalToken(),
        inputData,
        backChannel
      );
    } else if (command.trim() == "query") {
      console.log("creating");
      var userList = oktaConnect.queryUsers(
        store.getGlobalToken(),
        inputData,
        backChannel
      );
    } else if (command.trim() == "update") {
      console.log("creating");
      var userList = oktaConnect.updateUser(
        store.getGlobalToken(),
        inputData,
        backChannel
      );
    }
  } catch (e) {
    console.log("Incorrect tokens");
  }
};
//Listen to requests
(async () => {
  http
    .createServer(function(request, response) {
      response.writeHead(200, { "Content-Type": "text/plain" });
      response.end();

      let data = [];
      request.on("data", chunk => {
        data.push(chunk.toString());
      });

      request.on("end", () => {
        try {
          var text = JSON.parse(data[0]).event.text;
          var channel = JSON.parse(data[0]).event.channel;
          console.log("text sent: " + data[0]);
          exports.processData(text, channel);
        } catch (e) {
          //console.log("Request failed")
        }
      });
    })
    .listen(process.env.PORT || 3000);
})();
