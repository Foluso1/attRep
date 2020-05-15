const Worker = require("../models/worker")
    , Disciple = require("../models/disciple")
    , Report = require("../models/report")
    , flash = require("connect-flash")
    ;
    
module.exports = {
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            res.locals.loggedInWorker = req.user;
            return next()
        }
        req.flash("error", "You have to log in first");
        res.redirect("/login");
    },

    isLMA: (req, res, next) => {
        if(req.user.isLMA) {
            return next()
        }
        req.flash("error", "Access denied. You have to be in the LMA to do this");
        res.send("Not in LMA!");
    },

    validator: async (req, res, next) => {
        let worker = { _id: req.user.id }
        try {
            let foundWorker = await Worker.findById(worker);
            foundWorker.validate((err) => {
                if (!(err === null)) {
                    console.log(err);
                    req.flash("error", "Please sir/ma, fill in one or more details missing in your profile");
                    res.redirect("/profile");
                } else {
                    return next();
                }
            });
        } catch (error) {
            req.flash("error", error.message);
            res.redirect("/profile");
        }
    },

    signInWithGoogle: async (req, res, next) => {
        try {
            if (req.user._id) {
                let worker = { _id: req.user._id }
                let foundWorker = await Worker.findById(worker);
                if (foundWorker.googleIdentity) {
                    foundWorker.linkCount = undefined;
                    await foundWorker.save()
                    return next();
                } else {
                    foundWorker.linkCount++;
                    await foundWorker.save();
                    if (foundWorker.linkCount <= 1){
                        res.render("linkWithGoogle");
                    } else {
                        return next();
                    }
                }
            }
        } catch (e) {
            console.log(e)
            req.flash("error", "Please, sign up with Google or login by other methods if you have an account already")
            res.redirect("/login");
        }
    },

    emailCheck: async (req, res, next) => {
        try {
            let userId = req.user._id;
            let foundWorker = await Worker.findById({ _id: userId});
            if (!foundWorker.email){
                res.render("email");
            } else {
                return next();
            }
        } catch (e) {
            console.log(e)
        }
    },

}