const mongoose = require("mongoose");
//Schema
const lockdownSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
  },

  data: {
    type: String,
    required: true,
  },

  dateOfReport: {
    type: Date,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

//Model and Export
module.exports = mongoose.model("Lockdown", lockdownSchema);
