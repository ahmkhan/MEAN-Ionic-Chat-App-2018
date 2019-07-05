const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    FullName: {type: String},
    UserName: {type: String},
    Email: {type: String},
    Password: {type: String},
    Posts: [{
        PostId: {type: mongoose.Schema.Types.ObjectId, ref:'Posts'},
        Post: {type: String},
        CreatedAt: {type: Date, default: Date.now()}
    }],
    UserFollowing: [
        {UserFollowed: {type: mongoose.Schema.Types.ObjectId, ref:'Users'}}
    ],
    UserFollowers: [
        {UserFollower: {type: mongoose.Schema.Types.ObjectId, ref:'Users'}}
    ],
    Notifications: [
        {
            SenderId: {type: mongoose.Schema.Types.ObjectId, ref:'Users'},
            Message: {type: String},
            ViewProfile: {type: Boolean, default: false},
            CreatedAt: {type: Date, default: Date.now()},
            MsgRead: {type: Boolean, default: false},
            NotificationViewDate: {type: String, default: ''}
        }
    ]
});

module.exports = mongoose.model('Users', userSchema);