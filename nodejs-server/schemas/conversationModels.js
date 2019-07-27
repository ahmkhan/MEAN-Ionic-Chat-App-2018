const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
    Participants : [
        {
            SenderId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
            ReceiverId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'}
        }
    ]
});

module.exports = mongoose.model('Conversations', conversationSchema);