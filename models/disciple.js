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

    gender: {
        type: String,
    },

    email: {
        type: String,
    },

    mobileNumber: {
        type: Number,
    },

    address: {
        type: String,
    },

    believersConventionAccommodation: {
        type: Boolean,
        default: false
    },

    charisCampmeetingAccommodation: {
        type: Boolean,
        default: false
    },
    
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Disciple", discipleSchema);