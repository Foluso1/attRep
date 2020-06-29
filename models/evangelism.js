const mongoose = require("mongoose");
//Schema
const evangelismSchema = new mongoose.Schema({
     
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
