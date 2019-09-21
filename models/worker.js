const                   mongoose    =   require("mongoose")
        ,   passportLocalMongoose   =   require("passport-local-mongoose")
        ,   sundayReport            =   require("./sundayReport")
        ;

workerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: "You have to specify this"
    },
    // lastname: {
    //     type: String,
    //     required: "You have to specify this"
    // },
    password: {
        type: String,
        required: "You have to specify this"
    },
    // level: {
    //     type: String,
    //     required: "You have to specify this"
    // },
    date: {
        type: Date,
        default: Date.now
    },
    disciples: [sundayReportSchema]
});

workerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Worker", workerSchema);