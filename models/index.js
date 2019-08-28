require("dotenv").config();
const   mongoose    =   require("mongoose");
mongoose.set("debug", true);

mongoose.connect(process.env.DB_workers, { useNewUrlParser: true });

mongoose.Promise = Promise;

module.exports.Worker = require("../models/worker");