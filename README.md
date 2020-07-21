
Slack bot integration with Okta

To start the application

1. Install the Client application in your Slack
2. Pass the tokens in the following format 'token [oktaToken],[slack bot token],[slack signed secret]'
3. If the slack tokens are correct, you will get a response saying that tokens are set successfully,
  if you don't get a response, it means that the slack tokens are not set correctly, the application needs those tokens to respond.
  Without them it cannot respond with the appropriate error message
  
Files:

index.js - this is the primary file, it listens to incoming requests and takes appropriate actions based on them. Making requets to the okta_connector.js
okta_connector.js - this file handles all parsing and requests to Okta. Called by index.js
slack_callback.js - Handles 'callbacks' to Slack
store.js - maintains token global variables