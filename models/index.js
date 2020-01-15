require("dotenv").config();
const   mongoose    =   require("mongoose");
mongoose.set("debug", true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

mongoose.connect(process.env.DB_workers, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.Promise = Promise;

module.exports.db = require("./worker");