const       mongoose                =   require("mongoose")
        ,   passportLocalMongoose   =   require("passport-local-mongoose")
        ,   db                      =   require("./index")


const prayerGroupSchema = new mongoose.Schema({
    coordinator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worker"
    },
    attendance: [
        {
            firstname: {
                type: String,
            },
            surname: {
                type: String,
            },
            arrivalTime: {
                type: String,
            },
            status: {
                type: String,
            },
            zone: {
                type: String,
            },
        }
    ],
    date: {
        type: Date,
        default: Date.now(),
    },
});


module.exports = mongoose.model("PrayerGroup", prayerGroupSchema);