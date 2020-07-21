
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
jasmine_tests.js - Unit tests for parsers

Possible commands

token - sets up the appropriate tokens
list - Lists all users in Okta, makes an API requests for to Okta to get all users
create - Creates a user in Okta, makes an API request to Okta to create
query - returns requested fields for a user, makes a request to Okta to get all Users, and then queries the returned object
update- updates a user in Okta. First gets all the users in Okta, queries for the user to update by E-mail, updates appropriates fields in object. Then makes a 2nd request to perfrom the update