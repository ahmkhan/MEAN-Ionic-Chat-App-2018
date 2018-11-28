const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    FullName: {type: String},
    UserName: {type: String},
    Email: {type: String},
    Password: {type: String},
});

module.exports = mongoose.model('Users', userSchema);