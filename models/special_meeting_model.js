const       mongoose    =   require("mongoose");
const       moment      =   require("moment");

const specialMeetingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    year: {
        type: String,
        default: moment().year().toString(),
    },
    
    day: {
        type: Number,
    },
    
    session: {
        type: Number,
    },

    disciples: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Disciple'
    }],

    workers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
    }],

    date: {
        type: Date,
        default: Date.now
    }
})

// specialMeeting.index({ attendee: 1, year: 1}, {unique: true});

module.exports = mongoose.model("SpecialMeeting", specialMeetingSchema);