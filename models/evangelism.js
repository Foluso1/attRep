const mongoose = require("mongoose");
//Schema
const evangelismSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
  },

  date: {
    type: Date,
    default: Date.now,
  },
  
  data: {
    type: String,
    required: true,
  },

  dateOnReport: {
    type: Date,
  },

});

//Model and Export
module.exports = mongoose.model("Evangelism", evangelismSchema);
