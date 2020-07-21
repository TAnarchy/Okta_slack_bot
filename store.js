// This is not a real datastore, but it can be if you make it one :)

let messages = {}
let users = {}
let me = undefined
let defaultChannel = undefined
let oktaToken = undefined
let botToken=undefined
let slackSecret=undefined

exports.getMessages = () => {
  return messages
}

exports.addUser = (user) => {
  users[user.user] = user
}

exports.getUser = (id) => {
  return users[id]
}

exports.setChannel = (channel) => {
  defaultChannel = channel
}

exports.getChannel = () => {
  return defaultChannel
}

exports.setMe= (id) => {
  me = id
}

exports.getMe= () => {
  return me
}

exports.setOktaToken=(token)=>{
  oktaToken=token
}

exports.getOktaToken=(token)=>{
  return oktaToken
}

exports.setBotToken=(token)=>{
  botToken=token
}

exports.getBotToken=(token)=>{
  return botToken
}

exports.setSlackSecret=(token)=>{
  slackSecret=token
}

exports.getSlackSecret=(token)=>{
  return slackSecret
}