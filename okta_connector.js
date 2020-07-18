const https = require('https');
const okta_url=process.env.OKTA_URL
const okta_token=process.env.OKTA_TOKEN
const okta_path=process.env.OKTA_PATH
const okta = require('@okta/okta-sdk-nodejs');



exports.getUsers = () => {
  try{
    const okta_client = new okta.Client({
      orgUrl: okta_url,
      token: "00O5uxkxKYooyJEJZMgqDaahNdCaFK15AQi7ZqZ9Pp"    // Obtained from Developer Dashboard
    });
    //otykmxcq6cniUHjZ74x6
  var toReturn=""
    okta_client.getUser('otykmxcq6cniUHjZ74x6')
.then(user => {
  toReturn=toReturn+JSON.Stringify(user)
});
    toReturn = toReturn =" INBETWEEN "
    var users=okta_client.listUsers()
    users.each(user => {
      toReturn=toReturn+" "+user
    })
    return toReturn
  }
  catch(e){
    return e
  }
}



