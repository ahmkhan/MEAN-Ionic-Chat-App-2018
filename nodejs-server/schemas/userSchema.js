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
    ]
});

module.exports = mongoose.model('Users', userSchema);