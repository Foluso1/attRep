const                   mongoose    =   require("mongoose")
        ,   passportLocalMongoose   =   require("passport-local-mongoose")
        ,   Report                  =   require("./discipleship_model")
        ,   Attendance              =   require("./attendance_model")
        ,   Disciple                =   require("./disciple")
        ,   Prayer                  =   require("./prayer")
        ,   PrayerChain             =   require("./prayerChain")
        ,   Lockdown                =   require("./lockdown")
        ,   Evangelism              =   require("./evangelism")
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

    gender: {
        type: String,
        required: false,
    },
    
    address: {
        type: String,
        required: false,
    },

    mobileNumber: {
        type: String,
        required: false,
    },

    maritalStatus: {
        type: String,
        required: false,
    },

    employmentStatus: {
        type: String,
        required: false,
    },

    dateOfBirth: {
        type: Date,
        required: false,
    },

    membershipClass: {
        type: Date,
        required: false,
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

    overseer: [
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

    attendance: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Attendance'
        }
    ],

    expected_attendance: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Expected'
        }
    ],

    lockdown: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lockdown'
        }
    ],

    evangelism: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Evangelism'
        }
    ],

    belConv: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BelConv'
        }
    ],

    isLMA: {
        type: Boolean,
        default: false
    },

    isAdmin: {
        type: Boolean,
        default: false,
    },

    linkCount: {
        type: Number,
        default: 0
    },

    discAssoc: {
        type: Boolean,
        default: false,
    },
 
    date: {
        type: Date,
        default: Date.now
    }
});

workerSchema.plugin(passportLocalMongoose, { usernameQueryFields: ["email"] });

module.exports = mongoose.model("Worker", workerSchema);