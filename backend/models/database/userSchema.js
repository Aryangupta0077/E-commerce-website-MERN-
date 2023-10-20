const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    "email":String,
    "password":String,
    "role":{
        type:String,
        default:"user"
    }
})

const userModel = mongoose.model("userData",userSchema);

module.exports = userModel;