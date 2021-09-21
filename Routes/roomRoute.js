const express= require('express')
// controllers
const roomController = require('../controller/roomController');

const router = express.Router();

router.get('/', roomController.getRecentConversation)
router.get('/:roomId', roomController.getConversationByRoomId)
router.post('/initiate', roomController.initiate)
router.post('/:roomId/message', roomController.postMessage)
router.put('/:roomId/mark-read', roomController.markConversationReadByRoomId)

module.exports = router;