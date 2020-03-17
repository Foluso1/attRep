const mongoose = require("mongoose")
    , passportLocalMongoose = require("passport-local-mongoose")
    ;

userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: "You have to specify this"
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);