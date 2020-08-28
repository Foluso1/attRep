const mongoose = require("mongoose")
    ;

//Schema
const prayerChainSchema = new mongoose.Schema({
    prayor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
    },

    start: {
        type: Date,
        required: true
    },

    end: {
        type: Date
    },
    
    date: {
        type: Date,
        default: Date.now
    }
});

//Model and Export
module.exports = mongoose.model("PrayerChain", prayerChainSchema);
