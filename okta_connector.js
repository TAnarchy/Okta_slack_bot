const https = require('https');
const okta_url=process.env.OKTA_URL
const okta_token=process.env.OKTA_TOKEN
const okta_path=process.env.OKTA_PATH
exports.getUsers = () => {
  
  var headers={"Authorization":"SSWS 00O5uxkxKYooyJEJZMgqDaahNdCaFK15AQi7ZqZ9Pp"}
  
  var options = {
  hostname: okta_url,
  path: okta_path,
  method: 'GET',
  headers:headers
};
  
  var blank=""
var req = https.request(options, function(res) {
  console.log("statusCode: ", res.statusCode);
  console.log("headers: ", res.headers);
 
  res.on('data', function(d) {
    blank="not"
    return "Success"
  });
});
req.end();

req.on('error', function(e) {
  blank="not"
  return "failure"
});
 
  while(blank=""){}
  
}
