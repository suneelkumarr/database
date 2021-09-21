const express = require('express');
const router = express.Router()

const {encode} = require('../middleware/jwt')



router
  .post('/login/:userId', encode, (req, res, next) => {
    return res
      .status(200)
      .json({
        success: true,
        authorization: req.authToken,
      });
  });

  module.exports =router;