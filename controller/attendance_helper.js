const   Worker                  =   require("../models/worker")
    ,   Disciple                =   require("../models/disciple")
    ,   Attendance              =   require("../models/attendance_model")
    ,   flash                   = require("connect-flash")
    ,   duplicateCheck          =   require("../utils/duplicateCheck")
    ;
const moment = require("moment");
const { findByIdAndDelete } = require("../models/attendance_model");



module.exports = {
    getReports: async (req, res) => {
        try {
            let worker = { _id: req.user.id };
            let foundWorker = await Worker.findById(worker)
              .populate({ path: "attendance", populate: {path: "disciples"} })
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
            let worker = {_id: req.user.id}
            let startOfToday = moment().startOf('day').format();
            let att =  await Attendance.find({summoner: req.user.id, "date": {$gte: startOfToday}}).populate("disciples");
            let db_Worker = JSON.parse(JSON.stringify(att));

            let thisReport = {
                title: req.body.title,
                for: req.body.for,
                info: req.body.info,
                summoner: req.user.id,
            };
            let newReport = await Attendance.create(thisReport)
            newReportId = newReport._id;
            const ids = req.body.ids;   
        
            const arr = [];
            
            let i = 0;
            if (ids) {
                while (!(arr.length === ids.length)) {
                    let id = ids[i];
                    let foundDisciple = await Disciple.findById(id);
                    newReport.disciples.push(foundDisciple);
                    let yesSaved = await newReport.save();
                    // yesSaved;
                    if (yesSaved) {
                        arr.push("yesSaved");
                        i++; 
                    }
                } 
            }
            
            let foundWorker = await Worker.findById(worker);

            let result = duplicateCheck(newReport, db_Worker);

            if (result) {
                req.flash("error", "Duplicate report detected");
                res.json("ERROR, Duplicate Report")
                await Attendance.findByIdAndDelete({_id: newReportId});
            } else {
                req.flash("success", "Succcessfully Reported");
                foundWorker.attendance.push(newReport);
                let savedWorker = await foundWorker.save();
                if (savedWorker) {
                    res.json("Done");
                }
            }
        } catch (error) {
            console.log(error)
            req.flash("error", "You must complete your profile first");
            res.redirect("/register");
        }
    },

    newReport: (req, res) => {
        let worker = {
            _id: req.user.id
        }
        Worker.findById(worker).populate("disciples")
            .then((thisWorker) => {
                let allDisciples = thisWorker.disciples
                res.render("attendance/attendance_new", { allDisciples });
            })
            .catch((err) => {
                console.log(err);
            });
    },

    editOneReport: async (req, res) => {
        try {
            let thisReportId = req.params.id;
            let worker = {
              _id: req.user.id
            };
            //get all disciples
            let foundWorker = await Worker.findById(worker)
              .populate({ path: "attendance"})
              .populate("disciples");
            //   .then(foundWorker => {
                let allDisciples = foundWorker.disciples;
                let allReports = foundWorker.attendance;
                // Look for the position of this report in the allReports array
                // Map all ids into an array
                let idsAllReports = allReports.map(elem => {
                  return elem._id;
                });
                // Look for position of thisReportId in that array
                let index = idsAllReports.indexOf(thisReportId);
                //stringify the disicples in array
                let remDisciples = allDisciples.map(disc => {
                  return disc;
                });

                //get ids of disciples in report
                let thisReport = await Attendance.findById(thisReportId)
                  .populate("disciples")
                    let discReport = thisReport.disciples;
                    if (discReport && discReport.length !== 0) {
                      let idsDiscReport = discReport.map(disc => {
                        return disc._id.toString();
                      });
                      //find the index of ids of disciples in allDisciples and remove each {forEach} for list of remaining disciples
                      let idsAllDisciples = allDisciples.map(disc => {
                        return disc._id;
                      });
                      // if discReport[i]._id find in allDisciples
                      // Remove if it is found

                      idsDiscReport.forEach(async disc => {
                        let i = idsAllDisciples.indexOf(disc);
                        remDisciples.splice(i, 1);
                        idsAllDisciples.splice(i, 1);
                      });
                    }
                    res.render("attendance/attendance_edit", { thisReport, remDisciples, thisReportId, index, foundWorker });
        } catch (e) {
            console.log(e)
        }
        
        //make new variable for list of remaining disciples
        //display remaining disciples on the right
    },

    getOneReport: async (req, res) => {
        let thisReportId = req.params.id;
        let worker = {
            _id: req.user.id
        }
        try {
            let foundWorker = await Worker.findById(worker).populate({ path: 'attendance', populate: { path: 'disciples' } });
            let thisReport = await Attendance.findById(thisReportId).populate("disciples")
            let allReports = foundWorker.attendance;
            
            let idsAllReports = allReports.map((elem) => {
                return elem._id;
            })
            // Look for position of thisReportId in that array
            let index = idsAllReports.indexOf(thisReportId);
            res.render("attendance/attendance_one", { thisReport, thisReportId, index });            
        } catch (error) {
            console.log(err);
        }
    },

    deleteReport: (req, res) => {
        thisReportId = req.params.id;
        Attendance.findByIdAndRemove({ _id: thisReportId })
        .then((good) => {
            res.redirect("/attendance")
            res.json(good);
        })
        .catch((err) => {
            console.log(err);
        })
    },

    removeDisciple: (req, res) => {
        thisReportId = req.params.id;
        Attendance.findById(thisReportId)
            .then((good) => {
                Disciple.findById(req.body._id)
                .then((found) => {
                })
                let allFoundDisciples = good.disciples;
                allFoundDisciples.forEach((elem, i) => {
                    if (elem === null) {
                        allFoundDisciples.splice(i, 1);
                    }
                })
                let idsAllFoundDisciples = allFoundDisciples.map((disc) => {
                    return disc._id;
                })
                let index = idsAllFoundDisciples.indexOf(req.body._id);
                idsAllFoundDisciples.splice(index, 1);
                allFoundDisciples.splice(index, 1);
                good.save();
                res.json("removed");
            })
            .catch((err) => {
                console.log(err);
            })
    },

    addDisciple: (req, res) => {
        thisReportId = req.params.id;
        Attendance.findById(thisReportId)
            .then((good) => {
                good.disciples.push(req.body._id);
                good.save();
                res.json("added");
            })
            .catch((err) => {
                console.log(err);
            })
    },

    addNewDisciple: async (req, res) => {
        thisReportId = req.params.id;
        let worker = {
            _id : req.user.id
        }
        
        let newReport = await Attendance.create(new Attendance)
        try {
            newReport.disciples.push(req.body._id);
            newReport.save();
            res.json("added");
            Worker.findById(worker)
            .then((foundWorker) => {
                foundWorker.attendance.push(newReport);
                foundWorker.save();
            })
            .catch((err) => {
                console.log(err);
            })
        } catch (error) {
            console.log(error)
        }
    },

    putReport: async (req, res) => {
        console.log(req.body);
        thisReportId = req.params.id;
        Attendance.findById(thisReportId)
        .then((good) => {
            good.info = req.body.info;
            good.for = req.body.for;
            good.title = req.body.title;
            good.save();
            res.redirect("/attendance");
        })
        .catch((err) => {
            req.flash("error", "There was a problem")
            console.log(err);
        })
    }
}

