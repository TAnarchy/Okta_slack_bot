const https = require('https');
const store = require('./store');
const okta_url=process.env.OKTA_URL
const okta_token=process.env.OKTA_TOKEN
const okta_path=process.env.OKTA_PATH
const okta = require('@okta/okta-sdk-nodejs');
//const req = require('sync-request');
const then_request=require('then-request')
const slack_call = require('./slack_callback')
var returnValue="";



exports.parseUsers = (val) => {
  returnValue=returnValue+val.profile.firstName+" "+val.profile.email+"\n" 
}


exports.getUsers =(auth,back_channel) =>{
  try{
    then_request("GET",okta_url+okta_path,{
      headers :{
        'Authorization':auth
      }
    }).done((res)=>{exports.parseResponse(res,back_channel)})
  } catch (e)
  {
    return e
  }
}

exports.createUser=(auth,params,back_channel) =>{
  var user_profile=exports.generate_profile(params)
  
}

exports.generate_profile=(kvp_string)=>{
  var arr=kvp_string.split(" ")
  arr.shift()
  var table = arr.map(pair => pair.split("="))
  var result={}
  table.forEach(([key,value]) => result[key] = value);
  return result;
}

exports.parseResponse=(response,back_channel)=>
{
  var utf8_response=JSON.parse(response.getBody("utf-8"))
  if (utf8_response.errorSummary!=undefined)
  {
    slack_call.postMessageTestWithText(utf8_response.errorSummary,back_channel)
  }
  else
  {
    utf8_response.map(exports.parseUsers)
    slack_call.postMessageTestWithText(returnValue,back_channel)
  }
}