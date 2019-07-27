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
                },
                Notifications: {
                    SenderId: req.user._id,
                    Message:`${req.user.FullName} is now Following you.`            //All other fields have default value in Schema so dont need to add here
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
            },
            $push: {
                Notifications: {
                    SenderId: req.user._id,
                    Message:`${req.user.FullName} is now Un-Following you.`            //All other fields have default value in Schema so dont need to add here
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


module.exports.MarkOrDeleteNotification = (req, res) => {
        const MarkNotificationAsReadOrDeleteNotificationMethod = async () => {
            if (!req.body.deleteValue) {
                await UserSchema.updateOne({
                    _id: req.user._id,
                    "Notifications._id": req.body.id
                }, {
                    $set: {
                        "Notifications.$.MsgRead": true
                    }
                });
            }
            else {
                await UserSchema.updateOne({
                    _id: req.user._id,
                    "Notifications._id": req.body.id
                }, {
                    $pull: {
                        Notifications: {_id: req.body.id}
                    }
                });
            }
        };

        MarkNotificationAsReadOrDeleteNotificationMethod().then(() => {
            if (!req.body.deleteValue) {
                res.status(HttpStatus.OK).json({status: true, message:'Notification Successfully Mark as Read'});
            }
            else {
                res.status(HttpStatus.OK).json({status: true, message:'Notification Deleted Successfully'});
            }
        })
            .catch((err) => {
                if (!req.body.deleteValue) {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, message:'Error occurred on Notification Mark as Read'});
                }
                else {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, message:'Error occurred on Notification Deleting'});
                }
            });
};


module.exports.markAllNotificationsAsRead = (req, res) => {
        const markAllNotificationsAsReadMethod = async () => {
                await UserSchema.update({
                    _id: req.user._id,
                }, {
                    $set: {
                        "Notifications.$[elem].MsgRead": true
                    }
                }, {
                    arrayFilters: [{'elem.MsgRead' : false}], multi: true
                });
        };

    markAllNotificationsAsReadMethod().then(() => {
                res.status(HttpStatus.OK).json({status: true, message:'All Notifications Successfully Mark as Read'});
        })
            .catch((err) => {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, message:'Error occurred on Notifications Mark as Read'});
            });
};