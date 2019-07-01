const Joi                   = require('joi');
const HttpStatus            = require('http-status-codes');
const PostSchema            = require('../schemas/postModels');
const UserSchema            = require('../schemas/userSchema');


module.exports.FollowUser = (req, res) => {
    const followUserAsyncMethod = async () => {

        await UserSchema.update({
            _id: req.user._id,
            "UserFollowing.UserFollowed": {$ne: req.body.userFollowedId}
        }, {
            $push: {
                UserFollowing: {
                    UserFollowed: req.body.userFollowedId
                }
            }
        });

        await UserSchema.update({
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