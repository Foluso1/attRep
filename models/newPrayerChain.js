const mongoose = require("mongoose");

const newPrayerChainSchema = new mongoose.Schema({
    week: {
        type: Number,
        default: 0,
    },
    frequency: {
        type: Number,
        default: 0,
    },
    0: {
        start: {
            type: Date,
            default: null,
        },
        end: {
            type: Date,
            default: null,
        },
        duration: {
            type: Number,
            default: 0,
        },
        prayed: {
            type: Boolean,
            default: false,
        }
    },
    1: {
        start: {
            type: Date,
            default: null,
        },
        end: {
            type: Date,
            default: null,
        },
        duration: {
            type: Number,
            default: 0,
        },
        prayed: {
            type: Boolean,
            default: false,
        }
    },
    2: {
        start: {
            type: Date,
            default: null,
        },
        end: {
            type: Date,
            default: null,
        },
        duration: {
            type: Number,
            default: 0,
        },
        prayed: {
            type: Boolean,
            default: false,
        }
    },
    3: {
        start: {
            type: Date,
            default: null,
        },
        end: {
            type: Date,
            default: null,
        },
        duration: {
            type: Number,
            default: 0,
        },
        prayed: {
            type: Boolean,
            default: false,
        }
    },
    4: {
        start: {
            type: Date,
            default: null,
        },
        end: {
            type: Date,
            default: null,
        },
        duration: {
            type: Number,
            default: 0,
        },
        prayed: {
            type: Boolean,
            default: false,
        }
    },
    5: {
        start: {
            type: Date,
            default: null,
        },
        end: {
            type: Date,
            default: null,
        },
        duration: {
            type: Number,
            default: 0,
        },
        prayed: {
            type: Boolean,
            default: false,
        }
    },
    6: {
        start: {
            type: Date,
            default: null,
        },
        end: {
            type: Date,
            default: null,
        },
        duration: {
            type: Number,
            default: 0,
        },
        prayed: {
            type: Boolean,
            default: false,
        }
    },
    prayor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = new mongoose.model("newPrayerChain", newPrayerChainSchema)