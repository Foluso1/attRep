const Worker = require("../models/worker")
    , PrayerGroup = require("../models/prayerGroup")
    , Prayer = require("../models/prayer")
    , duplicateCheck2 = require("../utils/duplicateCheck2")
    , flash = require("connect-flash")

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
      let foundPrayerGroup = await PrayerGroup.find({ coordinator: req.body.coordinator }).sort({date: -1}).limit(1);
      let obj = {
        firstname: req.body.firstname,
        surname: req.body.surname,
        arrivalTime: req.body.arrival,
        status: req.body.status,
        zone: req.body.zone,
        prayerGroup: req.body['prayer-group']
      }
      foundPrayerGroup = foundPrayerGroup[0];

      let isEqual = foundPrayerGroup.attendance.some((item) => duplicateCheck2(obj, item))
  
      if(isEqual){
        req.flash("error", "Duplicate report detected!"); 
        res.redirect("/prayergroup");
      } else {
        foundPrayerGroup.attendance.push(obj);
        foundPrayerGroup.save();
        res.render(`prayerGroupCoord/success`, {foundPrayerGroup});
      }
    } catch (e) {
      console.log(e);
    }
  },

  getForm: (req, res) => {
    res.render("prayerGroupCoord/prayerGroupCoord")
  },

  admin: async (req, res) => {
    let userId = req.user.id;
    let foundPrayerGroup = await PrayerGroup.find({ coordinator: userId });
    res.render("prayerGroupCoord/genCode", {foundPrayerGroup});
  },

  genCode: async (req, res) => {
    try {
      let prayerGroup = await PrayerGroup.create({
        coordinator: req.user.id,
      })
      let foundWorker = await Worker.findById({ _id: req.body.userId });
      foundWorker.prayerCode = req.body.thisRanNum;
      foundWorker.prayerCodeExpires = Date.now() + (60 * 60 * 1000);
      foundWorker.save();
      res.json({prayerGroup, code: foundWorker.prayerCode});
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
    let thisUser = req.user;
    oneReport.attendance.sort((a,b) => {
      return a.zone - b.zone;
    })
    const sortToObject = (arr, zone) => {
      let obj = {};
      arr.forEach((item) => {
        if(!obj[item[zone]]){
          obj[item[zone]] = [item];
        } else {
          obj[item[zone]].push(item);
        }
      })
      return obj;
    }
    let total = oneReport.attendance.length;
    oneReport = sortToObject(oneReport.attendance, "status");

    res.render("prayerGroupCoord/onePrayerGroup", {oneReport, total, thisUser});
  },

  deleteReport: async (req, res) => {
    try {
      let id = req.params.id;
      let thisReport = await PrayerGroup.findByIdAndDelete({ _id: id });
      console.log(thisReport);
      res.json("deleted");
    } catch (e) {
      console.log(e);
    }
  },

  deleteOneAttendee: async (req, res) => {
    try {
      let id = req.params.id;
      let id2 = req.params.id2;
      let thisReport = await PrayerGroup.findById({ _id: id });
      let thisAttendee = thisReport.attendance;
      thisAttendee.forEach((obj, i) => {
        if(obj._id == req.params.id2){
          thisAttendee.splice(i, 1);
          return
        }
      })
      thisReport.save();
      res.json("deleted");
    } catch (e) {
      console.log(e);
    }
  }
};

