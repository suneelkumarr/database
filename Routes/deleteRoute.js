const express = require('express');
const router = express.Router()

const deleteController = require('../controller/deleteController')


router.delete('/room/:roomId', deleteController.deleteRoomById)
router.delete('/message/:messageId', deleteController.deleteMessageById)

module.exports = router