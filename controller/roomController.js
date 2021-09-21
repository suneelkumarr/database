// utils
const makeValidation = require('@withvoid/make-validation');
// models
const  ChatRoomModel = require('../model/roomModel');
const ChatMessageModel = require('../model/messageModel');
const UserModel  = require('../model/userModel');
const bcrypt = require("bcryptjs");
//encrypt database

//Checking the crypto module
const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

exports.initiate = async (req, res) => {
    try {
        const validation = makeValidation(types => ({
          payload: req.body,
          checks: {
            userIds: { 
                type: types.array,
              options: { unique: true, empty: false, stringOnly: true } 
            },
          }
        }));
        if (!validation.success) return res.status(400).json({ ...validation });
  
        const { userIds } = req.body;
        const {userIds: chatInitiator } = req;
        const allUserIds = [...userIds, chatInitiator];
        const chatRoom = await ChatRoomModel.initiateChat(allUserIds, chatInitiator);
        return res.status(200).json({ success: true, chatRoom });
      } catch (error) {
        return res.status(500).json({ success: false, error: error })
      }
}


exports.postMessage = async (req, res) => {
    try {
        const { roomId } = req.params;
        const validation = makeValidation(types => ({
          payload: req.body,
          checks: {
            messageText: { type: types.string },
          }
        }));
        if (!validation.success) return res.status(400).json({ ...validation });
  
        const messagePayload = {
          messageText: req.body.messageText,
        };
        
        const currentLoggedUser = req.userId;
        const post = await ChatMessageModel.createPostInChatRoom(roomId, messagePayload, currentLoggedUser);
        global.io.sockets.in(roomId).emit('new message', { message: post });
        // generate salt to hash password

        return res.status(200).json({ success: true, post });
      } catch (error) {
          console.log(error);
        return res.status(500).json({ success: false, error: error })
      }    
}


exports.getRecentConversation = async (req, res) => {
    try {
        const currentLoggedUser = req.userId;
        const options = {
          page: parseInt(req.query.page) || 0,
          limit: parseInt(req.query.limit) || 10,
        };
        const rooms = await ChatRoomModel.getChatRoomsByUserId(currentLoggedUser);
        const roomIds = rooms.map(room => room._id);
        const recentConversation = await ChatMessageModel.getRecentConversation(
          roomIds, options, currentLoggedUser
        );
        return res.status(200).json({ success: true, conversation: recentConversation });
      } catch (error) {
        return res.status(500).json({ success: false, error: error })
      }
}


exports.getConversationByRoomId = async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await ChatRoomModel.getChatRoomByRoomId(roomId)
        if (!room) {
          return res.status(400).json({
            success: false,
            message: 'No room exists for this id',
          })
        }
        const users = await UserModel.getUserByIds(room.userIds);
        const options = {
          page: parseInt(req.query.page) || 0,
          limit: parseInt(req.query.limit) || 10,
        };
        const conversation = await ChatMessageModel.getConversationByRoomId(roomId, options);
        return res.status(200).json({
          success: true,
          conversation,
          users,
        });
      } catch (error) {
          console.log(error);
        return res.status(500).json({ success: false, error });
      }
    
}



exports.markConversationReadByRoomId = async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await ChatRoomModel.getChatRoomByRoomId(roomId)
        if (!room) {
          return res.status(400).json({
            success: false,
            message: 'No room exists for this id',
          })
        }
  
        const currentLoggedUser = req.userId;
        const result = await ChatMessageModel.markMessageRead(roomId, currentLoggedUser);
        return res.status(200).json({ success: true, data: result });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error });
      }
}

