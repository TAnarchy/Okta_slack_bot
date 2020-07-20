const store = require('./store');

exports.tokenNotPresent = () => {
  var token=store.getOktaToken()
  if (!token)
    {
      return true
    }
  return false
}

exports.processData = (input_data) =>{
  var command = input_data.split(" ")[0]
  console.log("input data "+input_data.split(" ")[0])
}