//depandencies
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const logger = require("morgan")
// const bodyParser = require('body-parser')
// const cookieParser = require("cookie-parser");
// const session = require("express-session");
const cors = require("cors")
const path = require('path')
mongoose.Promise  = require("bluebird");
const app = express()
const server = require('http').createServer(app)
const io = require("socket.io")(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    },
});
global.io = io.listen(server);
//util socket file 
const socket = require('./utils/socket')

port = process.env.PORT || 5000
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes 
const deleteRoute = require('./Routes/deleteRoute')
const indexRoute = require('./Routes/indexRoute')
const roomsRoute = require('./Routes/roomRoute')
const userRoute = require('./Routes/userRoute')

//middleware 
const { decode } = require('./middleware/jwt')

//database conneted
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('database is connected')
  }).catch(err => console.log(err))

app.use(logger('dev'))


app.use("/", indexRoute);
app.use("/users", userRoute);
app.use("/room", decode, roomsRoute);
app.use("/delete", deleteRoute);

/** catch 404 and forward to error handler */
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint doesnt exist'
  })
});

global.io.on('connection', socket.connection)
app.listen(port,(req, res) => {
    console.log(`Server is running on ${port}`);
    console.log(`http://localhost:${port}`);
})