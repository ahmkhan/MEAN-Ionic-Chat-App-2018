const Joi                   = require('joi');
const HttpStatus            = require('http-status-codes');
const PostSchema            = require('../schemas/postModels');
const UserSchema            = require('../schemas/userSchema');


module.exports.GetAllUsers = async (req, res) => {
    try {
        const allPeoples = await UserSchema.find({})
            .populate('Posts.PostId')
            .populate('UserFollowing.UserFollowed')
            .populate('UserFollowers.UserFollower');

        res.status(HttpStatus.OK).json({message:'All Users Found Successfully', Users: allPeoples});
    }
    catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'All Users Found Error', err: err});
    }
};


module.exports.GetUserById = async (req, res) => {
    try {
        const peopleById = await UserSchema.findOne({_id: req.params.id})
            .populate('Posts.PostId')
            .populate('UserFollowing.UserFollowed')
            .populate('UserFollowers.UserFollower');

        res.status(HttpStatus.OK).json({message:'User by Id Found Successfully', Users: peopleById});
    }
    catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'User by Id Found Error', err: err});
    }
};


module.exports.GetUserByUserName = async (req, res) => {
    try {
        const PeopleByUserName = await UserSchema.findOne({UserName: req.params.userName})
            .populate('Posts.PostId')
            .populate('UserFollowing.UserFollowed')
            .populate('UserFollowers.UserFollower');

        res.status(HttpStatus.OK).json({message:'User by UserName Found Successfully', Users: PeopleByUserName});
    }
    catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'User by UserName Found Error', err: err});
    }
};