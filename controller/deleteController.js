const Message  = require('../model/messageModel');
const Room = require('../model/roomModel');


exports.deleteRoomById = async (req, res) =>{
    try {
        const { roomId } = req.params;
        const room = await Room.remove({ _id: roomId });
        const messages = await Message.remove({ chatRoomId: roomId })
        return res.status(200).json({ 
          success: true, 
          message: "Operation performed succesfully",
          deletedRoomsCount: room.deletedCount,
          deletedMessagesCount: messages.deletedCount,
        });
      } catch (error) {
        return res.status(500).json({ success: false, error: error })
      }
}

exports.deleteMessageById = async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await Message.remove({ _id: messageId });
        return res.status(200).json({ 
          success: true, 
          deletedMessagesCount: message.deletedCount,
        });
      } catch (error) {
        return res.status(500).json({ success: false, error: error })
      }
}

