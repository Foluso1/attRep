const                   mongoose    =   require("mongoose")
                    ,   Disciples   =   require("./disciple")
                    ;

//Schema
const reportSchema = new mongoose.Schema({
    disciples: [discipleSchema],
    date: {
        type: Date,
        default: Date.now
    }
});

//Model and Export
module.exports = mongoose.model("Report", reportSchema);
