const store = require('./store');

exports.tokenNotPresent = () => {
  var token=store.getOktaToken()
  if (!token)
    {
      return true
    }
  return false
}

exports.processData=(incoming_text)=>{
 // console.log("In proces data")
  var command = incoming_text.split(" ")
  //console.log("command: "+command)
}


