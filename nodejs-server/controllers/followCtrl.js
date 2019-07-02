const Joi                   = require('joi');
const HttpStatus            = require('http-status-codes');
const PostSchema            = require('../schemas/postModels');
const UserSchema            = require('../schemas/userSchema');


module.exports.FollowUser = (req, res) => {
    const followUserAsyncMethod = async () => {

        await UserSchema.updateOne({
            _id: req.user._id,
            "UserFollowing.UserFollowed": {$ne: req.body.userFollowedId}
        }, {
            $push: {
                UserFollowing: {
                    UserFollowed: req.body.userFollowedId
                }
            }
        });

        await UserSchema.updateOne({
            _id: req.body.userFollowedId,
            "UserFollowers.UserFollower": {$ne: req.user._id}
        }, {
            $push: {
                UserFollowers: {
                    UserFollower: req.user._id
                }
            }
        });
    };

    followUserAsyncMethod().then(() => {
        res.status(HttpStatus.OK).json({status: true, message:'User following Successfully'});
    })
        .catch((err) => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, message:'Error occurred on User following'});
        });
};


module.exports.UnFollowUser = (req, res) => {
    console.log('req.body.userFollowedId', req.body.userFollowedId)
    const unFollowUserAsyncMethod = async () => {

        await UserSchema.updateOne({
            _id: req.user._id,
        }, {
            $pull: {
                UserFollowing: {
                    UserFollowed: req.body.userFollowedId
                }
            }
        });

        await UserSchema.updateOne({
            _id: req.body.userFollowedId,
        }, {
            $pull: {
                UserFollowers: {
                    UserFollower: req.user._id
                }
            }
        });
    };

    unFollowUserAsyncMethod().then(() => {
        res.status(HttpStatus.OK).json({status: true, message:'User Un-Following Successfully'});
    })
        .catch((err) => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, message:'Error occurred on User Un-Following'});
        });
};