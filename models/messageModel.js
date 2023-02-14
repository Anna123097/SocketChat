const {Schema, model} = require('mongoose')

const messageSchema = new Schema({
  username: {
    type: String, 
    required: false
  },
  message: {
    type: String, 
    required: true
  },
  type: {
    type: String,
    default: 'message'
  },
  chat: {
    type: Number,
    default: 1
  }
})

module.exports = model('message', messageSchema)