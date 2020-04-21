const                   mongoose    =   require("mongoose")
        ,   passportLocalMongoose   =   require("passport-local-mongoose")
        ,   Report                  =   require("./report")
        ,   Disciple                =   require("./disciple")
        ,   Prayer                  =   require("./prayer")
        ,   PrayerChain             =   require("./prayerChain")
        ,   Lockdown                =   require("./lockdown")
        ;

workerSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: "You have to specify this"
    },

    firstname: {
        type: String,
        required: "You have to specify this"
    },

    surname: {
        type: String,
        required: "You have to specify this"
    },

    email: {
        type: String,
        unique: true,
    },

    emailCheck: {
        type: String,
        required: false
    },

    googleIdentity: {
        type: String,
        required: false
    },

    googleName: {
        type: String,
        required: false
    }, 
    
    googleMail: {
        type: String,
        required: false
    },

    facebookIdentity: {
        type: String,
        required: false
    },

    facebookName: {
        type: String,
        required: false
    },
    
    password: {
        type: String,
        required: false
    },

    resetPasswordToken: {
        type: String,
        required: false
    },

    resetPasswordExpires: {
        type:   Date,
        required: false
    },

    church: {
        type: String, 
        required: "You have to specify this"
    },

    fellowship: {
        type: String,
        required: "You have to specify this"
    },

    department: {
        type: String,
        required: "You have to specify this"
    },

    prayerGroup: {
        type: String,
        required: "You have to specify this"
    },

    workers: [ 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Worker'
        }
    ],

    disciples: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Disciple'
        }
    ],

    prayerReport: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Prayer'
        }
    ],

    prayerChainReport: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PrayerChain'
        }
    ],

    reports: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Report'
        }
    ],

    lockdown: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lockdown'
        }
    ],

    isLMA: {
        type: Boolean,
        default: false
    },

    linkCount: {
        type: Number,
        default: 0
    },
 
    date: {
        type: Date,
        default: Date.now
    }
});

workerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Worker", workerSchema);