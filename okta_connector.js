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
  
  try{
  let user_profile=exports.generate_profile(params.trim())
  
  /* let user_profile={
  "profile": {
    "firstName": "Bowling",
    "lastName": "Brock",
    "email": "Bowling.brock@example.com",
    "login": "Bowling.brock@example.com",
    "mobilePhone": "555-415-1337"
  }
}*/
    
    then_request("POST",okta_url+okta_path+"?activate=false",{
      headers :{
        'Authorization':auth
      },
      json :{
        'profile':user_profile.profile
      }
    }).done((res)=>{exports.parseResponseCreate(res,back_channel)})
  } catch (e)
  {
    slack_call.postMessageTestWithText(e,back_channel)
  }
  
}

exports.generate_profile=(kvp_string)=>{
  slack_call.postMessageTestWithText(kvp_string.length,"D017PG3NAKT")
  let arr=kvp_string.split(" ")
  arr.shift()
  arr.push("login="+arr[0])
  arr[0]="email="+arr[0]
  let table = arr.map(pair => pair.split("="))
  let result={}
  result.profile={}
  table.forEach(([key,value]) => result.profile[key] = value);
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
    returnValue="";
    utf8_response.map(exports.parseUsers)
    slack_call.postMessageTestWithText(returnValue,back_channel)
  }
}

exports.parseResponseCreate=(response,back_channel)=>
{
  var utf8_response=JSON.parse(response.getBody("utf-8"))
  if (utf8_response.errorSummary!=undefined)
  {
    slack_call.postMessageTestWithText(utf8_response.errorSummary,back_channel)
  }
  else
  {
    returnValue="";
    slack_call.postMessageTestWithText(JSON.stringify(utf8_response),back_channel)
  }
}
//