const https = require('https');
const okta_url=process.env.OKTA_URL
const okta_token=process.env.OKTA_TOKEN
const okta_path=process.env.OKTA_PATH
const okta = require('@okta/okta-sdk-nodejs');



exports.getUsers = () => {
  try{
    const okta_client = new okta.Client({
      orgUrl: "https://moveworkseddie-admin.okta.com",
      token: "00O5uxkxKYooyJEJZMgqDaahNdCaFK15AQi7ZqZ9Pp"    // Obtained from Developer Dashboard
    });
    console.log("cat debugger")
    debugger
  
    var toReturn=""
    var users=okta_client.listUsers()
 
    return users
  }
  catch(e){
    return e
  }
}



