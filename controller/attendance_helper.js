const 
  Worker                = require("../models/worker"),
  Disciple              = require("../models/disciple"),
  Attendance            = require("../models/attendance_model"),
  flash                 = require("connect-flash"),
  duplicateCheck        = require("../utils/duplicateCheck"),
  postNewReport         = require("../utils/postReport"),
  // specialReportCheck    = require("../utils/specailReportCheck"),
  moment                = require("moment");
const postReport = require("../utils/postReport");

module.exports = {
  getReports: async (req, res) => {
    try {
      let worker = { _id: req.user.id };
      let foundWorker = await Worker.findById(worker).populate({
        path: "attendance",
        populate: { path: "disciples" },
      });
      //   .populate({ path: "disciples"})
      // populate("disciples")
      let attendance = foundWorker.attendance;
      res.render("attendance/attendance", { attendance, foundWorker });
    } catch (e) {
      console.log(e);
      req.flash("error", "There was a problem");
      res.redirect("/home");
    }
  },

  postNewReport: async (req, res) => {
    try {
      postReport(req, res, Attendance, "summoner")
      // let worker = { _id: req.user.id };
      // // Special Meeting Check
      // if (req.body.for.includes("Believer's") || req.body.for.includes("Charis")){
      //   const startOfYear = moment().startOf("year");
      //   let specialCheck = await Attendance.find({
      //     summoner: req.user.id,
      //     for: req.body.for,
      //     date: { $gte: startOfYear },
      //   });
      //   if(Array.isArray(specialCheck) && specialCheck.length > 0){
      //     req.flash("error", "Duplicate report detected, please edit previous report");
      //     return res.json("ERROR, Duplicate Report");
      //   }
      // } else {
      //   let att = await Attendance.find({
      //     summoner: req.user.id,
      //     for: req.body.for,
      //     date: { $gte: (Date.now() - (24*60*60*1000)) },
      //   }).populate("disciples");
      //   if (Array.isArray(att) && att.length > 0){
      //     req.flash("error", "Duplicate report detected, please edit previous report");
      //     return res.json("ERROR, Duplicate Report");
      //   }
      // }
      // const thisReport = {
      //   title: req.body.title,
      //   for: req.body.for,
      //   info: req.body.info,
      //   summoner: req.user.id,
      // };
      // const newReport = await Attendance.create(thisReport);
      // newReportId = newReport._id;
      // const ids = req.body.ids;

      // const arr = [];

      // let i = 0;
      // if (ids) {
      //   while (!(arr.length === ids.length)) {
      //     let id = ids[i];
      //     let foundDisciple = await Disciple.findById(id);
      //     newReport.disciples.push(foundDisciple);
      //     let yesSaved = await newReport.save();
      //     // yesSaved;
      //     if (yesSaved) {
      //       arr.push("yesSaved");
      //       i++;
      //     }
      //   }
      // }
      // let foundWorker = await Worker.findById(worker);
      // foundWorker.attendance.push(newReport);
      // let savedWorker = await foundWorker.save();
      // req.flash("success", "Succcessfully Reported");
      // if (savedWorker) {
      //   res.json("Done");
      // }
    } catch (error) {
      console.log(error);
      req.flash("error", "You must complete your profile first");
      res.redirect("/register");
    }
  },

  newReport: (req, res) => {
    let worker = {
      _id: req.user.id,
    };
    Worker.findById(worker)
      .populate("disciples")
      .then((thisWorker) => {
        let allDisciples = thisWorker.disciples;
        res.render("attendance/attendance_new", { allDisciples });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  editOneReport: async (req, res) => {
    try {
      let thisReportId = req.params.id;
      let worker = { _id: req.user.id, };
      //get all disciples
      let foundWorker = await Worker.findById(worker)
        .populate({ path: "attendance" })
        .populate("disciples");
      let allDisciples = foundWorker.disciples;
      let allReports = foundWorker.attendance;
      // Look for the position of this report in the allReports array
      // Map all ids into an array
      let idsAllReports = allReports.map((elem) => {
        return elem._id;
      });
      // Look for position of thisReportId in that array
      let index = idsAllReports.indexOf(thisReportId);
      //stringify the disicples in array
      let remDisciples = allDisciples.map((disc) => {
        return disc;
      });

      //get ids of disciples in report
      let thisReport = await Attendance.findById(thisReportId).populate(
        "disciples"
      );
      let discReport = thisReport.disciples;
      if (discReport && discReport.length >
         0) {
        let idsDiscReport = discReport.map((disc) => {
          return disc._id.toString();
        });
        //find the index of ids of disciples in allDisciples and remove each {forEach} for list of remaining disciples
        let idsAllDisciples = allDisciples.map((disc) => {
          return disc._id;
        });
        // if discReport[i]._id find in allDisciples
        // Remove if it is found

        idsDiscReport.forEach(async (disc) => {
          let i = idsAllDisciples.indexOf(disc);
          remDisciples.splice(i, 1);
          idsAllDisciples.splice(i, 1);
        });
      }
      res.render("attendance/attendance_edit", {
        thisReport,
        remDisciples,
        thisReportId,
        index,
        foundWorker,
      });
    } catch (e) {
      console.log(e);
    }

    //make new variable for list of remaining disciples
    //display remaining disciples on the right
  },

  getOneReport: async (req, res) => {
    let thisReportId = req.params.id;
    let worker = {
      _id: req.user.id,
    };
    try {
      let foundWorker = await Worker.findById(worker).populate({
        path: "attendance",
        populate: { path: "disciples" },
      });
      let thisReport = await Attendance.findById(thisReportId).populate(
        "disciples"
      );
      let allReports = foundWorker.attendance;

      let idsAllReports = allReports.map((elem) => {
        return elem._id;
      });
      // Look for position of thisReportId in that array
      let index = idsAllReports.indexOf(thisReportId);
      res.render("attendance/attendance_one", {
        thisReport,
        thisReportId,
        index,
      });
    } catch (e) {
      console.log(e);
    }
  },

  deleteReport: (req, res) => {
    thisReportId = req.params.id;
    Attendance.findByIdAndRemove({ _id: thisReportId })
      .then((good) => {
        req.flash("success", "Deleted successfully")
        res.redirect("/attendance");
        res.json(good);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  removeDisciple: async (req, res) => {
    try {
      thisReportId = req.params.id;

      let good = await Attendance.findById(thisReportId);
      let found = await Disciple.findById(req.body._id);
      let allFoundDisciples = good.disciples;
      allFoundDisciples.forEach((elem, i) => {
        if (elem === null) {
          allFoundDisciples.splice(i, 1);
        }
      });
      let idsAllFoundDisciples = allFoundDisciples.map((disc) => {
        return disc._id;
      });
      let index = idsAllFoundDisciples.indexOf(req.body._id);
      idsAllFoundDisciples.splice(index, 1);
      allFoundDisciples.splice(index, 1);
      await good.save();
      res.json("removed");
    } catch (e) {
      console.log(e);
      res.status(404).json("Not found");
    }
  },

  addDisciple: async (req, res) => {
    try {
      thisReportId = req.params.id;
      let good = await Attendance.findById(thisReportId);
      good.disciples.push(req.body._id);
      await good.save();
      res.json("added");
    } catch (e) {
      console.log(e);
      res.status(404).json("Not found");
    }
  },

  putReport: async (req, res) => {
    try {
      thisReportId = req.params.id;
      let good = await Attendance.findById(thisReportId);
      good.info = req.body.info;
      good.for = req.body.for;
      good.title = req.body.title;
      await good.save();
      res.redirect("/attendance");
    } catch (e) {
      req.flash("error", "There was a problem");
      console.log(e);
    }
  },
};
