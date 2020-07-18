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
  slack_call.postMessageTestWithText("User Profile "+JSON.stringify(user_profile),"D017PG3NAKT")
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
  //kvp_string.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
  var split_character=kvp_string.charAt(6)
  slack_call.postMessageTestWithText("KVP string is: "+kvp_string.charAt(6),"D017PG3NAKT")
  console.log("KVP STRING IS: "+kvp_string)
  let arr=kvp_string.split(split_character).join(',').split(" ").join(',').split(",")
  slack_call.postMessageTestWithText("ARray is: "+arr,"D017PG3NAKT")
  console.log("ARray is: "+arr)
  arr.shift()
  slack_call.postMessageTestWithText("ARray is v2: "+arr,"D017PG3NAKT")
  
  arr.push("login="+arr[0])
  arr[0]="email="+arr[0]
   slack_call.postMessageTestWithText("post edit: "+arr,"D017PG3NAKT")
  let table = arr.map(pair => pair.split("="))
  slack_call.postMessageTestWithText("table is "+table,"D017PG3NAKT")
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
  slack_call.postMessageTestWithText("post response create "+response.getBody(),"D017PG3NAKT")
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