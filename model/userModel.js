
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const userSchema = new Schema({
//   userId: { type: String, default: "", required: true },
//   username: { type: String, default: "", required: true },
//   email: { type: String, default: "", required: true },
//   password: { type: String, default: "", required: true },
//   token:{type: String},
//   createdOn: { type: Date, default: Date.now },
//   updatedOn: { type: Date, default: Date.now }
// });
// mongoose.model("User", userSchema);


const { 
    v4: uuidv4,
  } = require('uuid');

// export const USER_TYPES = {
//   CONSUMER: "consumer",
//   SUPPORT: "support",
// };

const userSchema = new  Schema (
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    firstName: String,
    lastName: String,
    email:{ 
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: "Email address is required",
        validate: {
          validator: function (v) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
          },
          message: "Please enter a valid email",
        },
    },
    token: { type:String}
    // type: String,
  },
  {
    timestamps: true,
    collection: "users",
  }
);

/**
 * @param {String} firstName
 * @param {String} lastName
 * @returns {Object} new user object created
 */
userSchema.statics.createUser = async function (firstName, lastName, email) {
  try {
    const user = await this.create({ firstName, lastName, email });
    return user;
  } catch (error) {
    throw error;
  }
}

/**
 * @param {String} id, user id
 * @return {Object} User profile object
 */
userSchema.statics.getUserById = async function (id) {
  try {
    const user = await this.findOne({ _id: id });
    if (!user) throw ({ error: 'No user with this id found' });
    return user;
  } catch (error) {
    throw error;
  }
}

/**
 * @return {Array} List of all users
 */
userSchema.statics.getUsers = async function () {
  try {
    const users = await this.find();
    return users;
  } catch (error) {
    throw error;
  }
}

/**
 * @param {Array} ids, string of user ids
 * @return {Array of Objects} users list
 */
userSchema.statics.getUserByIds = async function (ids) {
  try {
    const users = await this.find({ _id: { $in: ids } });
    return users;
  } catch (error) {
    throw error;
  }
}

/**
 * @param {String} id - id of user
 * @return {Object} - details of action performed
 */
userSchema.statics.deleteByUserById = async function (id) {
  try {
    const result = await this.remove({ _id: id });
    return result;
  } catch (error) {
    throw error;
  }
}

const User= mongoose.model("User", userSchema);
module.exports = User