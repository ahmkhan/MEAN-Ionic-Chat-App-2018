const UserModel = require('../schemas/userSchema');

module.exports = {
    FirstLetterUpperCase: (userName) => {
        let name = userName.toLowerCase();
        return name.charAt(0).toUpperCase() + name.slice(1);
    },
    allLowerCase: (sentence) => {
        return sentence.toLowerCase();
    },
    updateChatListArrInUserModel: async (req, message) => {
        await UserModel.updateOne({
            _id: req.user._id
        }, {
            $pull: {
                ChatList:{
                    ReceiverId: req.params.receiverId
                }
            }
        });

        await UserModel.updateOne({
            _id: req.params.receiverId
        }, {
            $pull: {
                ChatList:{
                    ReceiverId: req.user._id
                }
            }
        });


        await UserModel.updateOne({
            _id: req.params.senderId
        }, {
            $push: {
                ChatList: {
                    $each: [
                        {
                            ReceiverId: req.params.receiverId,
                            MessageId: message._id
                        }
                    ],
                    $position: 0
                }
            }
        });

        await UserModel.updateOne({
            _id: req.params.receiverId
        }, {
            $push: {
                ChatList: {
                    $each: [
                        {
                            ReceiverId: req.params.senderId,
                            MessageId: message._id
                        }
                    ],
                    $position: 0
                }
            }
        });
    }
};