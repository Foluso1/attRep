const Worker = require("../models/worker")
    , PrayerGroup = require("../models/prayerGroup")
    , Prayer = require("../models/prayer")

    ;

module.exports = {

  start: async (req, res) => {
    let foundLMA = await Worker.find({
      isLMA: true,
    });

    res.render("prayerGroupCoord/codeCheck", {foundLMA});
  },

  checkCode: async (req, res) => {
    try {
      console.log(req.body);
      console.log(req.params);
      let foundPrayerGroup = await PrayerGroup.find({ coordinator: req.body.coordinator }).sort({date: -1}).limit(1);
      let obj = {
        firstname: req.body.firstname,
        surname: req.body.surname,
        arrivalTime: req.body.arrival,
        status: req.body.status,
        zone: req.body.zone,
      }
      console.log(foundPrayerGroup);
      foundPrayerGroup = foundPrayerGroup[0];
      foundPrayerGroup.attendance.push(obj);
      foundPrayerGroup.save();
      // res.json(foundPrayerGroup);
      //Let user see success report
      res.render(`prayerGroupCoord/success`, {foundPrayerGroup});
    } catch (e) {
      console.log(e);
    }
  },

  getForm: (req, res) => {
    res.render("prayerGroupCoord/prayerGroupCoord")
  },

  admin: async (req, res) => {
    let userId = req.user.id;
    console.log("userId", userId);
    let foundPrayerGroup = await PrayerGroup.find({ coordinator: userId });
    console.log(foundPrayerGroup);
    res.render("prayerGroupCoord/genCode", {foundPrayerGroup});
  },

  genCode: async (req, res) => {
    try {
      console.log(req.body);
      let prayerG = await PrayerGroup.create({
        coordinator: req.user.id,
      })
      console.log(prayerG);
      let foundWorker = await Worker.findById({ _id: req.body.userId });
      foundWorker.prayerCode = req.body.thisRanNum;
      foundWorker.prayerCodeExpires = Date.now() + (60 * 60 * 1000);
      foundWorker.save();
      res.json(foundWorker.prayerCode);
    } catch (e) {
      console.log(e);
    }
  },

  getAllReports: async (req, res) => {
    try {
      let foundReports = await PrayerGroup.find({ coordinator: req.user.id });
      res.render("prayerGroupCoord/allPrayerGroup", {foundReports});
    } catch (e) {
      console.log(e);
    }
  },

  getOneReport: async (req, res) => {
    let id = req.params.id
    let oneReport = await PrayerGroup.findById({ _id: id });
    res.render("prayerGroupCoord/onePrayerGroup", {oneReport});
  },
};

