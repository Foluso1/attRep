const                   mongoose    =   require("mongoose")
        ,   passportLocalMongoose   =   require("passport-local-mongoose")
        ,   Report                  =   require("./report")
        ,   Disciple                =   require("./disciple")
        ,   Prayer                  =   require("./prayer")
        ,   PrayerChain             =   require("./prayerChain")
        ;

workerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: "You have to specify this"
    },
    
    password: {
        type: String,
        required: "You have to specify this"
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

    isLMA: {
        type: Boolean,
        default: false
    },
 
    date: {
        type: Date,
        default: Date.now
    }
});

workerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Worker", workerSchema);