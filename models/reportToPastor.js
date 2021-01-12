const mongoose = require("mongoose");

const reportToPastorSchema = new mongoose.Schema({
    meeting: {
        name: { type: String },
        type: { type: String },
    },
    venue: { type: String },
    date: { type: Date },
    timeline: { type: Number },
    prayer: {
        duration: { type: Number },
        leader: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
    },
    worship: {
        duration: { type: Number },
        leader: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
        songs: { type: String }
    },
    teaching: {
        title: { type: String },
        duration: { type: Number },
        emphasis: { type: String },
        speaker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' }
    },
    announcement: { type: String },
    attendance: { type: Number },
    improvement: { type: String },
    attendees: {
        workers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Worker'}],
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Disciple'}],
        first_timers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Disciple'}],
        lma: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Worker' }],
    },
    offering: { type: Number },
    workers_meeting: {
        duration: { type: Number },
        leader: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
        emphasis: { type: String },
        attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Worker'}]
    },
    hygiene: {
        hand_wash: { type: Boolean },
        hand_sanitizer: { type: Boolean },
        face_mask: { type: Number }
    }
})

module.exports = mongoose.model("ReportToPastor", reportToPastorSchema);