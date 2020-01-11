const mongoose = require("mongoose")
    ;

//Schema
const prayerChainSchema = new mongoose.Schema({
    start: {
        type: Date,
        default: Date.now
    },

    end: {
        type: Date,
        required: true
    },
    
    date: {
        type: Date,
        default: Date.now
    }
});

//Model and Export
module.exports = mongoose.model("PrayerChain", prayerChainSchema);
