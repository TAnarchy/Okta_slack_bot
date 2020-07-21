const https = require("https");
const store = require("./store");
const oktaURL = process.env.oktaURL;
const oktaToken = process.env.oktaToken;
const oktaPath = process.env.oktaPath;
const okta = require("@okta/okta-sdk-nodejs");
const thenRequest = require("then-request");
const slackCall = require("./slack_callback");
const oktaTokenConst = "oktaToken";
const botTokenConst = "botToken";
const signedSecretConst = "signedSecret";
var returnValue = "";

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
exports.getUsers = (auth, backChannel, commandName, queryParams) => {
  try {
    console.log("Token to be passed: " + oktaURL + oktaPath);
    thenRequest("GET", oktaURL + oktaPath, {
      headers: {
        Authorization: auth[oktaTokenConst]
      }
    }).done(res => {
      if (commandName == "list") {
        exports.parseResponse(res, backChannel, auth);
      } else if (commandName == "query") {
        exports.parseResponseQuery(res, backChannel, queryParams, auth);
      } else if (commandName == "update") {
        exports.updateResponseQuery(res, auth, backChannel, queryParams, auth);
      }
    });
  } catch (e) {
    return e;
  }
};

//Makes a request to Okta to create a user
exports.createUser = (auth, params, backChannel) => {
  try {
    let userProfile = exports.generateProfileUniversal(params.trim());

    thenRequest("POST", oktaURL + oktaPath + "?activate=false", {
      headers: {
        Authorization: auth[oktaTokenConst]
      },
      json: {
        profile: userProfile.profile
      }
    }).done(res => {
      exports.parseResponseCreate(res, backChannel, auth);
    });
  } catch (e) {
    slackCall.postMessageBack("Error occured", backChannel, auth);
  }
};
//Incdicates a query request, makes a request to Okta to get all users before querying request
exports.queryUsers = (auth, params, backChannel) => {
  var userList = exports.getUsers(auth, backChannel, "query", params);
};
//Indicates an update request, makes a request to Okta, then queries for user to update, before making a 2nd reuqest to update
exports.updateUser = (auth, params, backChannel) => {
  var userList = exports.getUsers(auth, backChannel, "update", params);
};

//Parser, that converts user input string into okta profile object that can be submitted via API
exports.generateProfileUniversal = kvpString => {
  var arr = exports.generateProfileQuery(kvpString);
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
exports.parseResponse = (response, backChannel, auth) => {
  try {
    var utf8Response = JSON.parse(response.getBody("utf-8"));
    if (utf8Response.errorSummary != undefined) {
      slackCall.postMessageBack(returnValue, backChannel, auth);
      slackCall.postMessageBack(
        utf8Response.errorSummary,
        backChannel,
        auth
      );
    } else {
      returnValue = "";
      utf8Response.map(exports.parseUsers);
      slackCall.postMessageBack(returnValue, backChannel, auth);
    }
  } catch (e) {
    slackCall.postMessageBack("Error occurred", backChannel, auth);
  }
};

//Callback function to 'create' command
exports.parseResponseCreate = (response, backChannel, auth) => {
  try {
    console.log("definitely caught error" + JSON.stringify(response));
    var utf8Response = JSON.parse(response.getBody("utf-8"));
    console.log(
      "definitely caught error again" + JSON.stringify(utf8Response)
    );
    if (utf8Response.errorSummary != undefined) {
      slackCall.postMessageBack(
        utf8Response.errorSummary,
        backChannel,
        auth
      );
    } else {
      let createReturn = "[Creation Successful]\n";
      for (const property in utf8Response.profile) {
        if (utf8Response.profile[property] != null) {
          createReturn += `${property}: ${utf8Response.profile[property]} \n`;
        }
      }
      slackCall.postMessageBack(createReturn, backChannel, auth);
    }
  } catch (e) {
    slackCall.postMessageBack(
      "Okta responded with an error, make sure values are correct and the user hasn't alreadybeen created",
      backChannel,
      auth
    );
  }
};

//call back function for 'query' command
exports.parseResponseQuery = (userList, backChannel, queryParams, auth) => {
  try {
    var searchParamsArray = exports.generateProfileQuery(queryParams);
    var userListBody = JSON.parse(userList.getBody("utf-8"));
    var e_mail = searchParamsArray.shift();
    var noramlizeEmail = exports.deLinkEmail(e_mail);
    console.log("normalized_email: " + noramlizeEmail);
    console.log(userListBody);
    var queriedUser = userListBody.filter(obj =>
      obj.profile.email.includes(noramlizeEmail.trim())
    )[0];
    var toReturnQuery = `Email: ${e_mail}\n`;
    searchParamsArray.forEach(
      element =>
        (toReturnQuery += `${element}: ${queriedUser.profile[element]}\n`)
    );
    slackCall.postMessageBack(toReturnQuery, backChannel, auth);
  } catch (e) {
    slackCall.postMessageBack("Query failed", backChannel, auth);
  }
};
//parser that converts input paramters and values into an array
exports.generateProfileQuery = kvpString => {
  return kvpString.split(/\s+/).slice(1);
};
//first callback function for 'update', queries all users by E-mail, and makes 2nd reuqest to update
exports.updateResponseQuery = (userList, auth, backChannel, queryParams) => {
  try {
    var searchParamsResult = exports.generateProfileUniversal(queryParams);
    var e_mail = searchParamsResult.profile.email;
    var userListBody = JSON.parse(userList.getBody("utf-8"));

    var queriedUser = userListBody.filter(obj =>
      obj.profile.email.includes(e_mail.trim())
    )[0];
    for (const property in searchParamsResult.profile) {
      queriedUser.profile[property] = searchParamsResult.profile[property];
    }
    var queriedUserId = queriedUser.id;
    console.log(
      "PUt destiantion:" + oktaURL + oktaPath + "/" + queriedUserId
    );
    console.log("PUt profile:" + JSON.stringify(queriedUser.profile));
    thenRequest("PUT", oktaURL + oktaPath + "/" + queriedUserId, {
      headers: {
        Authorization: auth[oktaTokenConst]
      },
      json: {
        profile: queriedUser.profile
      }
    }).done(res => {
      exports.parseResponseUpdate2(res, backChannel, auth);
    });

    slackCall.postMessageBack("Update successful", backChannel, auth);
  } catch (e) {
    slackCall.postMessageBack("Query failed", backChannel, auth);
  }
};
//2nd callback function for 'Update'
exports.parseResponseUpdate2 = (res, backChannel, auth) => {
  var utf8Response = JSON.parse(res.getBody("utf-8"));
  let updateReturn = "[Update Successful]\n";
  for (const property in utf8Response.profile) {
    if (utf8Response.profile[property] != null) {
      updateReturn += `${property}: ${utf8Response.profile[property]} \n`;
    }
  }
  slackCall.postMessageBack(updateReturn, backChannel, auth);
};

//Slack automatically hyerplinks E-mails, parses E-mail from hyperlink
exports.deLinkEmail = email => {
  var returnEmail = email;
  if (email.includes("mailto")) {
    email = email.split(":")[1];
    email = email.split("|")[0];
    returnEmail = email;
  }
  return returnEmail;
};
