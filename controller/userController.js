// utils
const makeValidation = require('@withvoid/make-validation');
// models
const UserModel = require('../model/userModel');

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
            email: {type: types.string}
          }
        }));
        if (!validation.success) return res.status(400).json({ ...validation });
  
        const { firstName, lastName , email } = req.body;
        const user = await UserModel.createUser(firstName, lastName, email);
        return res.status(200).json({ success: true, user });
      } catch (error) {
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


