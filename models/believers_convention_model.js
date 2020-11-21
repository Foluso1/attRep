const       mongoose    =   require("mongoose");
const       moment      =   require("moment");
const       MeetingDays =   require("../utils/meetingDays");

const believersConventionSchema = new mongoose.Schema({
    year: {
        type: String,
        default: moment().year().toString(),
    },
    0: {
        0: {
            type: Boolean,
            default: false,
        },
        1: {
            type: Boolean,
            default: false,
        },
        2: {
            type: Boolean,
            default: false,
        },
    },
    1: {
        0: {
            type: Boolean,
            default: false,
        },
        1: {
            type: Boolean,
            default: false,
        },
        2: {
            type: Boolean,
            default: false,
        },
    },
    2: {
        0: {
            type: Boolean,
            default: false,
        },
        1: {
            type: Boolean,
            default: false,
        },
        2: {
            type: Boolean,
            default: false,
        },
    },
    3: {
        0: {
            type: Boolean,
            default: false,
        },
        1: {
            type: Boolean,
            default: false,
        },
        2: {
            type: Boolean,
            default: false,
        },
    },
    4: {
        0: {
            type: Boolean,
            default: false,
        },
        1: {
            type: Boolean,
            default: false,
        },
        2: {
            type: Boolean,
            default: false,
        },
    },
    5: {
        0: {
            type: Boolean,
            default: false,
        },
        1: {
            type: Boolean,
            default: false,
        },
        2: {
            type: Boolean,
            default: false,
        },
    },
    6: {
        0: {
            type: Boolean,
            default: false,
        },
        1: {
            type: Boolean,
            default: false,
        },
        2: {
            type: Boolean,
            default: false,
        },
    },
    attendance: {
        type: Boolean,
        default: false
    },
    attendee: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'Disciple'
    },
    date: {
        type: Date,
        default: Date.now
    }
})

believersConventionSchema.index({ attendee: 1, year: 1}, {unique: true});

module.exports = mongoose.model("BelConv", believersConventionSchema);