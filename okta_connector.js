const https = require('https');
const okta_url=process.env.OKTA_URL
const okta_token=process.env.OKTA_TOKEN
const okta_path=process.env.OKTA_PATH
const okta = require('@okta/okta-sdk-nodejs');
const req = require('sync-request');



exports.getUsers = () => {
  /*try{
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
  }*/
  
  var userRes=req("GET",okta_url+okta_path,{
    headers :{
      'Authorization':'SSWS 00O5uxkxKYooyJEJZMgqDaahNdCaFK15AQi7ZqZ9Pp'
    }
  })
  
  return userRes.getBody("utf-8")
}



