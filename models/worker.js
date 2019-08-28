const mongoose = require("mongoose");

//Schema
const workerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "You have to specify this!"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

//Model and Export
module.exports = mongoose.model("Worker", workerSchema);
