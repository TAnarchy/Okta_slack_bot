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
  returnValue=returnValue+val.profile.firstName+" "+val.profile.lastName+" "+val.profile.email+"\n" 
}


exports.getUsers =(auth,back_channel,extra) =>{
  try{
    then_request("GET",okta_url+okta_path,{
      headers :{
        'Authorization':auth
      }
    }).done((res)=>{
      if(extra=="list")
        {
          exports.parseResponse(res,back_channel)
        }
      else
        {
          return res
        }
    })
  } catch (e)
  {
    return e
  }
}

exports.createUser=(auth,params,back_channel) =>{
  
  try{
  let user_profile=exports.generate_profile(params.trim())
  //slack_call.postMessageTestWithText("User Profile "+JSON.stringify(user_profile),"D017PG3NAKT")
  console.log("User Profile "+JSON.stringify(user_profile))

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

exports.queryUser=(auth,params,back_channel)=>{
  try{
    var listResponse=exports.getUsers(auth,back_channel,"query")
    var 
    
  }
  catch(e)
    {
      slack_call.postMessageTestWithText(e,back_channel)
    }
}

exports.generate_profile_query=(kvp_string)=>{
  //kvp_string.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
  var split_character=kvp_string.charAt(5)
  console.log("KVP STRING IS: "+kvp_string)
  let arr=kvp_string.split(split_character).join(',').split(" ").join(',').split(",")
  console.log("ARray is: "+arr)
  arr.shift()
  return arr
}


exports.generate_profile=(kvp_string)=>{
  //kvp_string.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
  var split_character=kvp_string.charAt(6)
  console.log("KVP STRING IS: "+kvp_string)
  let arr=kvp_string.split(split_character).join(',').split(" ").join(',').split(",")
  console.log("ARray is: "+arr)
  arr.shift()
  
  
  arr.push("login="+arr[0])
  arr[0]="email="+arr[0]
  let table = arr.map(pair => pair.split("="))
  let result={}
  result.profile={}
  table.forEach(([key,value]) => result.profile[key] = value);
  var alteredValue=result.profile.email.split("|")[0]
  alteredValue=alteredValue.split(":")[1]
  result.profile.email=alteredValue
  result.profile.login=alteredValue
  return result;
}

exports.parseResponse=(response,back_channel)=>
{
  var utf8_response=JSON.parse(response.getBody("utf-8"))
  if (utf8_response.errorSummary!=undefined)
  {
    slack_call.postMessageTestWithText("Error path 2",back_channel)
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
  try{
  console.log("definitely caught error"+JSON.stringify(response))
  var utf8_response=JSON.parse(response.getBody("utf-8"))
  console.log("definitely caught error again"+JSON.stringify(utf8_response))
  if (utf8_response.errorSummary!=undefined)
  {
    slack_call.postMessageTestWithText(utf8_response.errorSummary,back_channel)
  }
  else
  {
    let createReturn ='[Creation Successful]\n'
    for (const property in utf8_response.profile) 
    {
      if (utf8_response.profile[property]!=null){
      //  say(`Okta Token set successfully to: ${store.getOktaToken()}`) 
        createReturn+=`${property}: ${utf8_response.profile[property]} \n`
       
      }
    }
    slack_call.postMessageTestWithText(createReturn,back_channel)
  }
  }catch (e){
    slack_call.postMessageTestWithText("Okta responded with an error, make sure values are correct and the user hasn't alreadybeen created",back_channel)
  }
}
//