const https = require("https");
const store = require("./store");
const okta_url = process.env.OKTA_URL;
const okta_token = process.env.OKTA_TOKEN;
const okta_path = process.env.OKTA_PATH;
const okta = require("@okta/okta-sdk-nodejs");
const then_request = require("then-request");
const slack_call = require("./slack_callback");
const oktaTokenConst = "oktaToken";
const botTokenConst = "botToken";
const signedSecretConst = "signedSecret";
var returnValue = "";

//In incoming bot string, recoves the command name as it is no longer necessary
exports.removeCommand = command_array => {
  command_array.shift();
  return command_array;
};

//Parses firstName, lastName, and eMail from returned user values
exports.parseUsers = val => {
  returnValue =
    returnValue +
    val.profile.firstName +
    " " +
    val.profile.lastName +
    " " +
    val.profile.email +
    "\n";
};

//Makes a request to Okta, to return all users
exports.getUsers = (auth, back_channel, commandName, queryParams) => {
  try {
    console.log("Token to be passed: " + auth[oktaTokenConst]);
    then_request("GET", okta_url + okta_path, {
      headers: {
        Authorization: auth[oktaTokenConst]
      }
    }).done(res => {
      if (commandName == "list") {
        exports.parseResponse(res, back_channel, auth);
      } else if (commandName == "query") {
        exports.parseResponseQuery(res, back_channel, queryParams, auth);
      } else if (commandName == "update") {
        exports.updateResponseQuery(res, auth, back_channel, queryParams, auth);
      }
    });
  } catch (e) {
    return e;
  }
};

//Makes a request to Okta to create a user
exports.createUser = (auth, params, back_channel) => {
  try {
    let user_profile = exports.generate_profile_universal(params.trim());

    then_request("POST", okta_url + okta_path + "?activate=false", {
      headers: {
        Authorization: auth[oktaTokenConst]
      },
      json: {
        profile: user_profile.profile
      }
    }).done(res => {
      exports.parseResponseCreate(res, back_channel, auth);
    });
  } catch (e) {
    slack_call.postMessageBack("Error occured", back_channel, auth);
  }
};
//Incdicates a query request, makes a request to Okta to get all users before querying request
exports.queryUsers = (auth, params, back_channel) => {
  var user_list = exports.getUsers(auth, back_channel, "query", params);
};
//Indicates an update request, makes a request to Okta, then queries for user to update, before making a 2nd reuqest to update
exports.updateUser = (auth, params, back_channel) => {
  var user_list = exports.getUsers(auth, back_channel, "update", params);
};

//Parser, that converts user input string into okta profile object that can be submitted via API
exports.generate_profile_universal = (kvp_string) => {
  var arr = exports.generate_profile_query(kvp_string);
  var email = arr.shift();
  console.log("PRELINK");
  email = exports.deLinkEmail(email);
  console.log("Delnked email is: " + email);
  let table = arr.map(pair => pair.split("="));
  let result = {};
  result.profile = {};
  table.forEach(([key, value]) => (result.profile[key] = value));
  result.profile["email"] = email;
  result.profile["login"] = email;
  return result;
};
//Call back function for user 'list' command
exports.parseResponse = (response, back_channel, auth) => {
  try {
    var utf8_response = JSON.parse(response.getBody("utf-8"));
    if (utf8_response.errorSummary != undefined) {
      slack_call.postMessageBack(returnValue, back_channel, auth);
      slack_call.postMessageBack(
        utf8_response.errorSummary,
        back_channel,
        auth
      );
    } else {
      returnValue = "";
      utf8_response.map(exports.parseUsers);
      slack_call.postMessageBack(returnValue, back_channel, auth);
    }
  } catch (e) {
    slack_call.postMessageBack("Error occurred", back_channel, auth);
  }
};

//Callback function to 'create' command
exports.parseResponseCreate = (response, back_channel, auth) => {
  try {
    console.log("definitely caught error" + JSON.stringify(response));
    var utf8_response = JSON.parse(response.getBody("utf-8"));
    console.log(
      "definitely caught error again" + JSON.stringify(utf8_response)
    );
    if (utf8_response.errorSummary != undefined) {
      slack_call.postMessageBack(
        utf8_response.errorSummary,
        back_channel,
        auth
      );
    } else {
      let createReturn = "[Creation Successful]\n";
      for (const property in utf8_response.profile) {
        if (utf8_response.profile[property] != null) {
          createReturn += `${property}: ${utf8_response.profile[property]} \n`;
        }
      }
      slack_call.postMessageBack(createReturn, back_channel, auth);
    }
  } catch (e) {
    slack_call.postMessageBack(
      "Okta responded with an error, make sure values are correct and the user hasn't alreadybeen created",
      back_channel,
      auth
    );
  }
};

//call back function for 'query' command
exports.parseResponseQuery = (user_list, back_channel, query_params, auth) => {
  try {
    var search_params_array = exports.generate_profile_query(query_params);
    var user_list_body = JSON.parse(user_list.getBody("utf-8"));
    var e_mail = search_params_array.shift();
    var normalize_email = exports.deLinkEmail(e_mail);
    console.log("normalized_email: " + normalize_email);
    console.log(user_list_body);
    var queried_user = user_list_body.filter(obj =>
      obj.profile.email.includes(normalize_email.trim())
    )[0];
    var toReturnQuery = `Email: ${e_mail}\n`;
    search_params_array.forEach(
      element =>
        (toReturnQuery += `${element}: ${queried_user.profile[element]}\n`)
    );
    slack_call.postMessageBack(toReturnQuery, back_channel, auth);
  } catch (e) {
    slack_call.postMessageBack("Query failed", back_channel, auth);
  }
};
//parser that converts input paramters and values into an array
exports.generate_profile_query = kvp_string => {
  var arr = kvp_string.split(/\s+/).slice(1);
 /* console.log("ARray is: " + arr);
  arr = exports.removeCommand(arr);*/
  return arr;
};
//first callback function for 'update', queries all users by E-mail, and makes 2nd reuqest to update
exports.updateResponseQuery = (user_list, auth, back_channel, query_params) => {
  try {
    var search_params_result = exports.generate_profile_universal(query_params);
    var e_mail = search_params_result.profile.email;
    var user_list_body = JSON.parse(user_list.getBody("utf-8"));

    var queried_user = user_list_body.filter(obj =>
      obj.profile.email.includes(e_mail.trim())
    )[0];
    for (const property in search_params_result.profile) {
      queried_user.profile[property] = search_params_result.profile[property];
    }
    var queried_user_id = queried_user.id;
    console.log(
      "PUt destiantion:" + okta_url + okta_path + "/" + queried_user_id
    );
    console.log("PUt profile:" + JSON.stringify(queried_user.profile));
    then_request("PUT", okta_url + okta_path + "/" + queried_user_id, {
      headers: {
        Authorization: auth[oktaTokenConst]
      },
      json: {
        profile: queried_user.profile
      }
    }).done(res => {
      exports.parseResponseUpdate2(res, back_channel, auth);
    });

    slack_call.postMessageBack("Update successful", back_channel, auth);
  } catch (e) {
    slack_call.postMessageBack("Query failed", back_channel, auth);
  }
};
//2nd callback function for 'Update'
exports.parseResponseUpdate2 = (res, back_channel, auth) => {
  var utf8_response = JSON.parse(res.getBody("utf-8"));
  let updateReturn = "[Update Successful]\n";
  for (const property in utf8_response.profile) {
    if (utf8_response.profile[property] != null) {
      updateReturn += `${property}: ${utf8_response.profile[property]} \n`;
    }
  }
  slack_call.postMessageBack(updateReturn, back_channel, auth);
};

//Slack automatically hyerplinks E-mails, parses E-mail from hyperlink
exports.deLinkEmail = email => {
  var returnEmail = email;
  if (email.includes("mailto")) {
    email = email.split("|")[1];
    email = email.replace(">", "");
    returnEmail = email;
  }
  return returnEmail;
};
