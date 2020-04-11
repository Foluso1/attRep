const   Worker      =   require("../models/worker")
    ,   Disciple    =   require("../models/disciple")
    ,   Report      =   require("../models/report")
    ,   flash       =   require("connect-flash")
    ,   Lockdown    =   require("../models/lockdown")
    ;



module.exports = {
    getReports: async (req, res) => {
        try {
            let worker = {
              _id: req.user.id
            };
            let foundWorker = await Worker.findById(worker)

            res.render("new/lockdown");
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
            let obj = {
                dateOfReport: new Date(req.body.date),
                data: JSON.stringify({
                    date: req.body.date,
                    exhortation: req.body.exhortation,
                    prayerChain: req.body['prayer-chain'],
                    discipleship: req.body['discipleship'],
                    evangelism: req.body.evangelism,
                    bibleStudy: req.body['bible-study'],
                    facebook: req.body.facebook,
                    studyGroup: req.body['study-group'],
                    optional: req.body.optional
                })
            }
            // let abc = JSON.stringify(obj.data);
            let lockdown = await Lockdown.create(obj);
            let foundWorker = await Worker.findById({ _id: req.user.id });
            foundWorker.lockdown.push(lockdown);
            foundWorker.save();
            console.log(foundWorker);
            req.flash("success", "Your report has been submitted successfully. Thank you!");
            res.redirect("/new/lockdown");
        } catch (error) {
            console.log(error)
            req.flash("error", "You must complete your profile first");
            res.redirect("/register");
        }
    },
}

