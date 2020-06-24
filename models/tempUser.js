const       mongoose                =   require("mongoose")
        ,   passportLocalMongoose   =   require("passport-local-mongoose")
        ,   db                      =   require("./index")


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: "You have to specify this"
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
});


module.exports = mongoose.model("TempUser", userSchema);