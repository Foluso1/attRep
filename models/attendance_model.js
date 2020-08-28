const                   mongoose    =   require("mongoose")
                    ,   Disciples   =   require("./disciple")
                    ;

//Schema
const attendanceSchema = new mongoose.Schema({
    summoner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
    },
    
    disciples: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Disciple'
        }
    ],

    title: {
        type: String,
    },

    for: {
        type: String,
    },

    info: {
        type: String,
    },

    date: {
        type: Date,
        default: Date.now
    },
});

//Model and Export
module.exports = mongoose.model("Attendance", attendanceSchema);
