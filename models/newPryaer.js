const mongoose = require("mongoose")
    ;

//Schema
const prayerSchema = new mongoose.Schema({
    prayor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
    },
    
    week: {
        type: Date,
    },

    date: {
        type: Date,
        default: Date.now
    }
});

//Model and Export
module.exports = mongoose.model("Prayer", prayerSchema);
