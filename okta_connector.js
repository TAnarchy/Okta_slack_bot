const https = require('https');
const store = require('./store');
const okta_url=process.env.OKTA_URL
const okta_token=process.env.OKTA_TOKEN
const okta_path=process.env.OKTA_PATH
const okta = require('@okta/okta-sdk-nodejs');
const req = require('sync-request');
const then_request=require('then-request')
const slack_call = require('./slack_callback')
var returnValue="";


exports.getUsers_sync = (auth) => {

  try{
    var userRes=req("GET",okta_url+okta_path,{
      headers :{
        'Authorization':auth
      }
    })
    var userResponse=JSON.parse(userRes.getBody("utf-8"))
    returnValue="";
    if (userResponse.errorSummary!=undefined)
    {
      returnValue=userResponse.errorSummary
    }
    else
    {
      userResponse.map(exports.parseUsers)
    }
    return returnValue
  } catch (e)
  {
    return e
  }
  //return JSON.parse(userRes.getBody("utf-8"))
  
}

exports.parseUsers = (val) => {
  returnValue=returnValue+val.profile.firstName+" "+val.profile.email+"\n" 
}

exports.goBackTest =() => {
  slack_call.postMessageTest()
}

exports.getUsers =(auth) =>{
  
  
  try{
    
  
    then_request("GET",okta_url+okta_path,{
      headers :{
        'Authorization':auth
      }
    }).done((res)=>{slack_call.postMessageTestWithText("Success back and back")})
  } catch (e)
  {
    return e
  }
}