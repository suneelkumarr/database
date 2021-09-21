const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const roomSchema = new Schema({
//   name1: { type: String, default: "", required: true },
//   name2: { type: String, default: "", required: true },
//   members: [],
//   lastActive: { type: Date, default: Date.now },
//   createdOn: { type: Date, default: Date.now }
// });

// mongoose.model("Room", roomSchema);

const { v4: uuidv4 } = require("uuid");

// export const CHAT_ROOM_TYPES = {
//   CONSUMER_TO_CONSUMER: "consumer-to-consumer",
//   CONSUMER_TO_SUPPORT: "consumer-to-support",
// };

const chatRoomSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    userIds: Array,
    // type: String,
    chatInitiator: String,
  },
  {
    timestamps: true,
    collection: "chatrooms",
  }
);

/**
 * @param {String} userId - id of user
 * @return {Array} array of all chatroom that the user belongs to
 */
chatRoomSchema.statics.getChatRoomsByUserId = async function (userId) {
  try {
    const rooms = await this.find({ userIds: { $all: [userId] } });
    return rooms;
  } catch (error) {
    throw error;
  }
};

/**
 * @param {String} roomId - id of chatroom
 * @return {Object} chatroom
 */
chatRoomSchema.statics.getChatRoomByRoomId = async function (roomId) {
  try {
    const room = await this.findOne({ _id: roomId });
    console.log(room);
    return room;
  } catch (error) {
    throw error;
  }
};

/**
 * @param {Array} userIds - array of strings of userIds
 * @param {String} chatInitiator - user who initiated the chat
 * @param {CHAT_ROOM_TYPES} type
 */
chatRoomSchema.statics.initiateChat = async function (userIds, chatInitiator) {
  try {
    const availableRoom = await this.findOne({
      userIds: {
        $size: userIds.length,
        $all: [...userIds],
      },
    });
    if (availableRoom) {
      return {
        isNew: false,
        message: "retrieving an old chat room",
        chatRoomId: availableRoom._doc._id,
      };
    }

    const newRoom = await this.create({ userIds, chatInitiator });
    return {
      isNew: true,
      message: "creating a new chatroom",
      chatRoomId: newRoom._doc._id,
    };
  } catch (error) {
    console.log("error on start chat method", error);
    throw error;
  }
};

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

module.exports = ChatRoom;
