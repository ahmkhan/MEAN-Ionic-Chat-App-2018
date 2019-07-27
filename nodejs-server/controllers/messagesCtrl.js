const Joi                   = require('joi');
const HttpStatus            = require('http-status-codes');
const PostSchema            = require('../schemas/postModels');
const UserSchema            = require('../schemas/userSchema');
const ConversationSchema    = require('../schemas/conversationModels');
const MessagesSchema        = require('../schemas/messagesModels');
const HelperMethods         = require('../helpers/helperFunctions');

module.exports.getMessages = async (req, res) => {
    try {
        const sender_Id = req.params.senderId;        // OR req.params.senderId
        const receiver_Id = req.params.receiverId;    // OR req.params.receiverId

        const conversation = await ConversationSchema.findOne({
            $or: [
                {
                    $and: [
                        {'Participants.SenderId': sender_Id},
                        {'Participants.ReceiverId': receiver_Id}
                    ]
                },
                {
                    $and: [
                        {'Participants.SenderId': receiver_Id},
                        {'Participants.ReceiverId': sender_Id}
                    ]
                }
            ]
        }).select('_id');

        if (conversation && conversation._id) {
            const messages = await MessagesSchema.findOne({
                ConversationId: conversation._id
            });
            res.status(HttpStatus.OK).json({status: true, message:'All Messages Find Successfully', messages: messages});
        }
        else {
            res.status(HttpStatus.NOT_FOUND).json({status: false, message:'Messages not found by Conversation ID'});
        }
    }
    catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, message:'Server Error occurred, Messages not found'});
    }
};


module.exports.sendMessages = (req, res) => {
    const sender_Id = req.body.senderId;        // OR req.params.senderId
    const receiver_Id = req.body.receiverId;    // OR req.params.receiverId

    ConversationSchema.find({
        $or: [
            {
                Participants: {
                    $elemMatch: {SenderId: sender_Id, ReceiverId: receiver_Id},
                }
            },
            {
                Participants: {
                    $elemMatch: {SenderId: receiver_Id, ReceiverId: sender_Id}
                }
            }
        ]
    }, async (err, result) => {
        if (err == null) {
            if (result.length == 0) {    //New Conversation
                const newConversation = new ConversationSchema();
                newConversation.Participants.push({
                    SenderId: sender_Id, ReceiverId: receiver_Id
                });
                const saveConversation = await newConversation.save();

                const newMessage = new MessagesSchema();
                newMessage.ConversationId = saveConversation._id;
                newMessage.SenderUserName = req.body.senderUserName;
                newMessage.ReceiverUserName = req.body.receiverUserName;
                newMessage.Messages.push({
                    SenderId: sender_Id,
                    ReceiverId: receiver_Id,
                    SenderUserName: req.body.senderUserName,
                    ReceiverUserName: req.body.receiverUserName,
                    MessageText: req.body.textMessage,
                    MsgIsRead: false,
                    CreatedAt: Date.now()
                });

                await UserSchema.updateOne({
                    _id: sender_Id
                }, {
                    $push: {
                        ChatList: {
                            $each: [
                                {
                                    ReceiverId: receiver_Id,
                                    MessageId: newMessage._id
                                }
                            ],
                            $position: 0
                        }
                    }
                });

                await UserSchema.updateOne({
                    _id: receiver_Id
                }, {
                    $push: {
                        ChatList: {
                            $each: [
                                {
                                    ReceiverId: sender_Id,
                                    MessageId: newMessage._id
                                }
                            ],
                            $position: 0
                        }
                    }
                });

                await newMessage.save().then((saveMsg) => {
                    res.status(HttpStatus.OK).json({status: true, message:'Message Successfully Saved in DB'});
                }).catch(errSaveMsg => {
                    console.log('errSaveMsg', errSaveMsg);
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, message:'Error in Message Saved in DB'});
                });
            }
            else {    // Existing Conversation
                const getMessageDoc = await MessagesSchema.findOne({ConversationId: result[0]._id});
                HelperMethods.updateChatListArrInUserModel(req, getMessageDoc);

                await MessagesSchema.update(
                    {
                        ConversationId: result[0]._id
                    },
                    {
                        $push: {
                            Messages: {
                                SenderId: sender_Id,
                                ReceiverId: receiver_Id,
                                SenderUserName: req.body.senderUserName,
                                ReceiverUserName: req.body.receiverUserName,
                                MessageText: req.body.textMessage,
                                MsgIsRead: false,
                                CreatedAt: Date.now()
                            }
                        }
                    }
                    )
                    .then((updateMsg) => {
                        res.status(HttpStatus.OK).json({status: true, message:'Message Successfully Update in DB'});
                    }).catch(errUpdateMsg => {
                        console.log('errUpdateMsg', errUpdateMsg);
                        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, message:'Error in Message Update in DB'});
                    });
            }
        }
        else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: false, message:'Error occurred on Finding Sender / Receiver Id in DB'});
        }
    });
};