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
        default: null 
    },

    end: {
        type: Date,
        default: null
    },
    
    duration: {
        type: Number,
        default: 0
    }
});

//Model and Export
module.exports = mongoose.model("PrayerChain", prayerChainSchema);
