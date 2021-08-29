const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')

// Routes
const item_route = require('./routes/item')
const user_route = require('./routes/user')
const card_route = require('./routes/card')
const auth_route = require('./routes/auth')

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}, () => {
  console.log('Dah konek, tempec!')
})

// Start http server
const http = require('http').createServer(app)

// ExpressJS Config
app.use(bodyParser.urlencoded({ extended: true }))
app.set('json spaces', 2)

app.use('/card', card_route)    // API EndPoint /card
app.use('/users', user_route)   // API EndPoint /users
app.use('/items', item_route)   // API EndPoint /items
app.use('/auth', auth_route)   // API EndPoint /auth

/*

---------------------------------------> RFID Card <--------------------------------------------------

GET http://localhost/card --> Cek kartu yang sedang aktif (yang sudah di-set di '/card/set_card_uid')
POST http://localhost/card/set_card_uid --> Set kartu yang mau diregistrasi
POST http://localhost/card/register_card --> Proses memasukkan data dari form registrasi ke database

---------------------------------------> Shop Items <-------------------------------------------------

GET http://localhost/items --> Cek semua item yang terdaftar di Database
POST http://localhost/items/add_item --> Proses memasukkan data dari form registrasi ke database

----------------------------------------> User List <-------------------------------------------------
GET http://localhost/users --> Cek semua user yang terdaftar di Database

*/

http.listen(80, () => {
  console.log('Listening to port 80')
})