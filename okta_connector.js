const https = require('https');
const okta_url=process.env.OKTA_URL
const okta_token=process.env.OKTA_TOKEN
const okta_path=process.env.OKTA_PATH
const okta = require('@okta/okta-sdk-nodejs');
const req = require('sync-request');



exports.getUsers = () => {

  
  var userRes=req("GET",okta_url+okta_path,{
    headers :{
      'Authorization':'SSWS 00O5uxkxKYooyJEJZMgqDaahNdCaFK15AQi7ZqZ9Pp'
    }
  })
  
  return JSON.parse(userRes.getBody("utf-8"))[0].profile.firstName
  
  
}



