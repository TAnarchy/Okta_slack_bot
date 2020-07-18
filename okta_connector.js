const https = require('https');
const okta_url=process.env.OKTA_URL
const okta_token=process.env.OKTA_TOKEN
exports.getUsers = () => {
  
  https.get(okta_url, (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    console.log(JSON.parse(data).explanation);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
  
  return "Users"
}
