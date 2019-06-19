const   fetch       = require('node-fetch'),
        userPic   = require('../models/user_pic.js');


module.exports = {
    /* Gets all pics of users */
    getUsersPic:async (req, res) => {
         await userPic.find({}).then(result => {
            if(result)
                res.send(JSON.stringify(result));
            else res.status(404).send(`{"Failure": "No Documents Were Found"}`);
        }, err =>{
            res.status(404).send(`{"Failure": "No Documents Were Found"}`);
        });
    }
}