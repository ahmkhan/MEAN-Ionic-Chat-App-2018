const Joi                   = require('joi');
const HttpStatus            = require('http-status-codes');
const PostSchema            = require('../schemas/postModels');
const UserSchema            = require('../schemas/userSchema');


module.exports.FollowUser = async (req, res) => {
    // try {
    //     const allPeoples = await UserSchema.find({}).populate('Posts.PostId')

    //     res.status(HttpStatus.OK).json({message:'All Users Found Successfully', Users: allPeoples});
    // }
    // catch (err) {
    //     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'All Users Found Error', err: err});
    // }
    console.log('here')
};