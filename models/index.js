require("dotenv").config();
const   mongoose    =   require("mongoose");
mongoose.set("debug", true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

mongoose.connect(process.env.DB_workers, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("MongoDB service started!");
});


mongoose.Promise = Promise;

module.exports.db = require("./worker");