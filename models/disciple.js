const                   mongoose    =   require("mongoose")
        ,   passportLocalMongoose   =   require("passport-local-mongoose")

discipleSchema = new mongoose.Schema({
    discipler: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
    },
    
    name: {
        type: String,
    },
    
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Disciple", discipleSchema);