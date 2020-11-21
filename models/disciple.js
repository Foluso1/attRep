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
        type: String,
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

    type: {
        type: String,
        default: "Disciple"
    },
    
    belConv: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BelConv'
        }
    ],

    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Disciple", discipleSchema);