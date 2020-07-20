const store = require('./store');

exports.tokenNotPresent = () => {
  var token=store.getOktaToken()
  if (!token)
    {
      return true
    }
  return false
}
