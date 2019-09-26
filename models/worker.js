const                   mongoose    =   require("mongoose")
        ,   passportLocalMongoose   =   require("passport-local-mongoose")
        ,   Report                  =   require("./report")
        ,   Disciple                =   require("./disciple")
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

    disciples: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Disciple'
        }
    ],

    reports: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Report'
        }
    ],
    // reports: [discipleSchema],
    // level: {
    //     type: String,
    //     required: "You have to specify this"
    // },
    date: {
        type: Date,
        default: Date.now
    }
});

workerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Worker", workerSchema);