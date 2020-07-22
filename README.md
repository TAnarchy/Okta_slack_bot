Slack bot integration with Okta

To start the application

1. Create a [slack app](https://api.slack.com/tutorials/hello-world-bolt) with Events URL pointing to your app.
2. In Slack generate a [bot token and a signed secret](https://api.slack.com/tutorials/hello-world-bolt)
2. Create an [Okta](https://www.okta.com/) account
3. In Okta get an [API token](https://developer.okta.com/docs/guides/create-an-api-token/overview/)
4. Pass the tokens in the following format 'token [oktaToken],[slack bot token],[slack signed secret]' for example token 34234234,xxb-324234,44323432
5. You can now run commands

Files:

* index.js - Node.js [web sever](https://nodejs.org/en/docs/guides/getting-started-guide/)
* okta_connector.js - Handles parsing and makings requests to [Okta](https://developer.okta.com/docs/reference/)
* slack_callback.js - Handles [callbacks](https://slack.dev/bolt-js/concepts#web-api) to Slack 
* store.js - Used to store session variables
* jasmine_tests.js - Unit tests for parsers using [Jasmine](https://jasmine.github.io/) 

Slack chat my accept the following commands:

token - sets up the appropriate tokens. example below.

    token 34234234,xxb-324234,44323432
list - Lists all users in Okta

    list
create - Creates a user in Okta

    create test@testEmail.com firstName=John lastName=Smith

query - returns requested fields for a given Email

    query test@testEmail.com lastName
    
update- updates a user in Okta. Passed fields are updated, not passed fields are kept the same

    update test@testEmail.com lastName=McDonald
