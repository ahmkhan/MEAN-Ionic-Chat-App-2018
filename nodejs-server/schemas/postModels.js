const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    User: {type: mongoose.Schema.Types.ObjectId, ref:'Users'},
    UserName: {type: String, default: ''},
    Post: {type: String, default: ''},
    Comments: [
        {
            UserId: {type: mongoose.Schema.Types.ObjectId, ref:'Users'},
            UserName: {type: String, default: ''},
            Comment: {type: String, default: ''},
            CreatedAt: {type: Date, default: Date.now()},
        }
    ],
    TotalLikes: {type: Number, default: 0},
    Likes: [
        {
            UserName: {type: String, default: ''} 
        }
    ],
    CreatedAt: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Posts', PostSchema);