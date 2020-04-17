const   Worker      =   require("../models/worker")
    ,   Disciple    =   require("../models/disciple")
    ,   Report      =   require("../models/report")
    ,   flash       =   require("connect-flash")
    ,   Lockdown    =   require("../models/lockdown")
    ,   moment      =   require("moment")
    ;



module.exports = {
    getReports: async (req, res) => {
        try {
            let worker = {
              _id: req.user.id
            };
            let foundWorker = await Worker.findById(worker).populate({
                path: "lockdown",
                options: { sort: { date: -1 } }
            });
            let theseLockdownReports = foundWorker.lockdown;
            let lockdownReports = theseLockdownReports.map((item)=>{
                return thisOne = {
                    id: item.id,
                    firstname: item.firstname,
                    surname: item.surname,
                    date: item.date, //Time of report creation
                    dateOfReport: moment(item.dateOfReport).format('DD/MM/YYYY'),  //Time stated on report by user
                    data: JSON.parse(item.data)
                }
            });
            res.render("new/lockdown", { lockdownReports });
        } catch (e) {
            console.log(e);
            req.flash("error", "There was a problem");
            res.redirect("/report");
        }
    },

    newReport: async (req, res) => {
        try {
            res.render("new/lockdownNew");
        } catch (e) {
            console.log(e);
            req.flash("error", "There was a problem!");
            res.render("/report");
        }
    },
    
    postNewReport: async (req, res) => {
        try {
            console.log(req.body);
            
            // Check if user already has a report for that date
            let dateOfReport = new Date(req.body.date)
            let startDateOfReport = moment(dateOfReport).startOf('day')._d.getTime();

            // Find reports in DB
            let foundWorker =  await Worker.findById({ _id: req.user.id }).populate("lockdown");
            let allLockdownReports = foundWorker.lockdown // Array;
            let reportCheck = false;

            // If array isn't empty
            if (allLockdownReports.length >= 1){
            reportCheck = allLockdownReports.reduce((acc, item) => {
                  console.log(moment(item.dateOfReport).startOf("day")._d.getTime());
                  if (startDateOfReport == moment(item.dateOfReport).startOf("day")._d.getTime()) {
                    return acc = true;
                  } else {
                    return acc = false;
                  }
                }, false);
                console.log("reportCheck", reportCheck);
            }
            if (reportCheck == true) {
              req.flash("error", "You have already reported for that day!");
              res.redirect("/new/lockdown");
            } else {
                let obj = {
                    dateOfReport: new Date(req.body.date),
                    data: JSON.stringify({
                      date: req.body.date,
                      exhortation: req.body.exhortation,
                      prayerChain: req.body["prayer-chain"],
                      discipleship: req.body["discipleship"],
                      evangelism: req.body.evangelism,
                      bibleStudy: req.body["bible-study"],
                      facebook: req.body.facebook,
                      studyGroup: req.body["study-group"],
                      telecast: req.body.telecast,
                      optional: req.body.optional,
                    }),
                  };
                // let abc = JSON.stringify(obj.data);
                let lockdown = await Lockdown.create(obj);
                foundWorker.lockdown.push(lockdown);
                foundWorker.save();
                req.flash("success", "Your report has been submitted successfully. Thank you!");
                res.redirect("/new/lockdown");
            }
        } catch (error) {
            console.log(error)
            req.flash("error", "Something went wrong");
            res.redirect("/register");
        }
    },

    delReport: async (req, res) => {
        try {
            lockdownId = req.params.id;
            foundLockdown = await Lockdown.findOneAndRemove({ _id: lockdownId});
            console.log("DELETED!!!!!")
            req.flash("success", "Deleted successfully!");
            res.redirect("/new/lockdown");
        } catch (e) {
            console.log(e);
            req.flash("error", "There was a problem!");
            res.render("/report");
        }
    },

    newRep: (req, res) => {
        console.log("HEYEYYYYYYY YOU!");
    },

    editReport: async (rep, res) => {
        try {
            let reportId = req.params.id;
            let foundReport = await Report.findById({ _id: reportId });
            res.render("/new/")
        } catch (e) {
            console.log(e)
            req.flash("error", "There was a problem");
            res.redirect("/report");
        }
    
    }
}

