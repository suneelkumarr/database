const express = require('express');
const router = express.Router()

const {encode} = require('../middleware/jwt')

const userController = require('../controller/userController')



router
  .post('/login/:userId', encode, userController.login);


  module.exports =router;
