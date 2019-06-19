var mongoose    = require('mongoose'),
    user_pic   = new mongoose.Schema({
        pic:        String
});

var user = mongoose.model('users_pic', user_pic);

module.exports = user;