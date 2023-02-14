const {Server} = require('socket.io')
const mongoose = require('mongoose')
const Message = require('./models/messageModel')
require('dotenv').config()

const io = new Server(5000, {
  cors:'*' //['http://localhost:3000/',  'http://192.168.1.139:3000']
})

const chats = [
  {
    id: 1,
    title: 'offtop'
  },
  {
    id: 2,
    title: 'public'
  },
  {
    id: 3,
    title: 'questions'
  }
]


mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('DB connected'))
.catch((e) => console.log(e))

const users = {}

io.on('connection', async (socket) => {
  console.log(`new user with id ${socket.id} connected!`);

  const allMessages = await Message.find()

  socket.emit("setInfo", {chats, allMessages})


  socket.on('newMessage', async (data) => {
    const newMessage = await new Message(data).save()
    io.emit("newMessage", newMessage)
  })

  socket.on('user joined', async ({username}) => {
    users[socket.id] = username
    const newMessage = await new Message({message: `${username} joined the chat`, type: 'system'}).save()
    io.emit("newMessage", newMessage)

  })


  socket.on('disconnect', async () => {
    const newMessage = await new Message({message: `${users[socket.id]} left the chat`, type: 'system'}).save()
    io.emit("newMessage", newMessage)
    delete users[socket.id]
  })
})
