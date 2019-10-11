const mongoose = require("mongoose")
    ;

//Schema
const prayerSchema = new mongoose.Schema({
    prayed: {
        type: Boolean,
        required: true
    },

    datePrayed: {
        type: Date
    },
    
    date: {
        type: Date,
        default: Date.now
    }
});

//Model and Export
module.exports = mongoose.model("Prayer", prayerSchema);
