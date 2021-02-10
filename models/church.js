const   mongoose    = require("mongoose");

const churchSchema = new mongoose.Schema({
    name: String,
    type: Number,
    location: String,
    pastor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker'
    },
    churchUnder: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Church'
    }],
    churchOver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Church'
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Church", churchSchema);

// 0 --> SCC
// 1 --> Church
// 2 --> Zone
// 3 --> Fellowship
// 4 --> Cell