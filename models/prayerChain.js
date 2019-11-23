const mongoose = require("mongoose")
    ;

//Schema
const prayerSchema = new mongoose.Schema({
    prayerChainStart: {
        type: Boolean,
        required: true
    },

    prayerChainEnd: {
        type: Date
    },
    
    date: {
        type: Date,
        default: Date.now
    }
});

//Model and Export
module.exports = mongoose.model("Prayer", prayerSchema);
