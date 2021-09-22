require('dotenv').config()
// utils
const makeValidation = require('@withvoid/make-validation');
// models
const UserModel = require('../model/userModel');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.onGetAllUsers = async(req, res) =>{
    try {
        const users = await UserModel.getUsers();
        return res.status(200).json({ success: true, users });
      } catch (error) {
        return res.status(500).json({ success: false, error: error })
      }
}

exports.onGetUserById = async(req, res) => {
    try {
        const user = await UserModel.getUserById(req.params.id);
        return res.status(200).json({ success: true, user });
      } catch (error) {
        return res.status(500).json({ success: false, error: error })
      }
}



exports.onCreateUser = async (req, res) => {
    try {
        const validation = makeValidation(types => ({
          payload: req.body,
          checks: {
            firstName: { type: types.string },
            lastName: { type: types.string },
            email: {type: types.string},
            password: { type: types.string}
          }
        }));
        if (!validation.success) return res.status(400).json({ ...validation });
  
        const { firstName, lastName , email, password } = req.body;
        const user = await UserModel.createUser(firstName, lastName, email, password);
            // generate salt to hash password
        const salt = await bcrypt.genSalt(10);
         // now we set user password to hashed password
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        return res.status(200).json({ success: true, user });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error })
      }
}

exports.login = async (req, res) => {
  try{

        // const { userId } = req.params;
        //  const userid = await UserModel.getUserById(userId);
      // Validate if user exist in our database
      const user = await UserModel.findOne({ email: req.body.email });
      // Validate user input
       if (!user) {
          return res.status(401).json({ err: "email not match" });
       }
      auth = await bcrypt.compare(req.body.password,user.password);
      if (!auth) {
              return res.status(401).json({ err: "password not match" });
            }

    const payload = {
              userId: user._id,
    };
      const token = jwt.sign(
      { payload },
              process.env.SECRET_KEY,
              {
                expiresIn: "2h",
              }
            );
      // save user token
    user.token = token; 
    await user.save();
    return res
      .status(200)
      .json({
        success: true,
        user,
        authorization: req.authToken,
      });

  }catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error })
  }
}

exports.onDeleteUserById = async(req, res) => {
    try {
        const user = await UserModel.deleteByUserById(req.params.id);
        return res.status(200).json({ 
          success: true, 
          message: `Deleted a count of ${user.deletedCount} user.` 
        });
      } catch (error) {
        return res.status(500).json({ success: false, error: error })
      }
}


