const mongoose = require('mongoose');

const messagesSchema = mongoose.Schema({
    ConversationId: {type: mongoose.Schema.Types.ObjectId, ref: 'Conversations'},
    SenderUserName: {type: String},
    ReceiverUserName: {type: String},
    Messages: [
        {
            SenderId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
            ReceiverId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
            SenderUserName: {type: String},
            ReceiverUserName: {type: String},
            MessageText: {type: String, default: ''},
            MsgIsRead: {type: Boolean, default: false},
            CreatedAt: {type: Date, default: Date.now()}

        }
    ]
});

module.exports = mongoose.model('Messages', messagesSchema);