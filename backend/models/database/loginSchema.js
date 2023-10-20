const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
    "phoneNumber":String,
    "password":String,
    "role":{
        type:String,
        default:"admin"
    }
})

const loginModel = mongoose.model("Login",loginSchema);

module.exports = loginModel;