const Worker = require("../models/worker")
    , Disciple = require("../models/disciple")
    , Report = require("../models/report")
    , flash = require("connect-flash")
    ;
    
module.exports = {
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }
        req.flash("error", "You have to log in first");
        res.redirect("/login");
    },

    isLMA: (req, res, next) => {
        if(req.user.isLMA) {
            return next()
        }
        console.log("Access Denied!")
        req.flash("error", "Access denied. You have to be in the LMA to do this");
        res.send("Not in LMA!");
    },

    validator: async (req, res, next) => {
        console.log("VALIDATOR");
        let worker = {
            _id: req.user.id
        }
        try {
            let foundWorker = await Worker.findById(worker);
            foundWorker.validate((err) => {
                if (!(err === null)) {
                    console.log(err);
                    console.log("First error", err.message);
                    req.flash("error", "Please sir/ma, fill in one or more details missing in your profile");
                    res.redirect("/profile");
                } else {
                    console.log("hey");
                    return next();
                }
            });
        } catch (error) {
            console.log("Second error", error.message);
            req.flash("error", error.message);
            res.redirect("/profile");
        }
    },
}