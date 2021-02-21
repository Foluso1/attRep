const Worker        =   require("../models/worker")
    , PrayerChain   =   require("../models/prayerChain")
    // , newPrayerChain   =   require("../models/newPrayerChain")
    , moment        =   require("moment")
    ;


module.exports = {
    postPrayerReport: async (req, res) => {
        try {
            let foundPrayerChain = await PrayerChain.findOne({
                prayor: req.user.id,
                start: { $gte: moment().startOf("day").format() },
            });
            console.log("///foundPrayerChain", foundPrayerChain);
            if (foundPrayerChain && foundPrayerChain.end == null) {
                foundPrayerChain.end = Date.now();
                await foundPrayerChain.save();
            } else if (!foundPrayerChain) {
                let newPrayerChain = await PrayerChain.create({
                    prayor: req.user.id,
                    start: Date.now(),
                })            
            } else {
                req.flash("error", "You have reported your prayer chain today");
            }
            return res.redirect("/prayerchain")
            // }
            // console.log(foundPrayerChain)
            // res.status(201).json(foundPrayerChain);
        } catch (err) {
            console.log(err);
            req.flash("error", "There was a problem");
            res.redirect("/prayerchain");
        }
    },

    getPrayerReports: async (req, res) => {
        try {
            let foundPrayerChain = await PrayerChain.findOne({
                prayor: req.user.id,
                start: { $gte: moment().startOf("day").format() }
            });
            res.render("prayerChain/prayerChain", {foundPrayerChain});
        } catch (err) {
            console.log(err);
            req.flash("error", "There was a problem!")
            res.redirect("/home")
        }
    },

    newPrayerReport: async (req, res) => {
        try {
            let foundPrayerChain = await PrayerChain.findOne({
                prayor: req.user.id,
                start: { $gte: moment().startOf("day").format() }
            });
            res.render("prayerChain/prayerChainNew", {foundPrayerChain});
        } catch (err) {
            console.log(err);
        }
        
    }, 

    getPrayerReportbyWeekNum: async (req, res) => {
        try {
            let foundPrayerChainArr = await newPrayerChain.find({
                prayor: req.user.id,
                week: req.params.weekNum,
            });
            let weekPrChain = foundPrayerChainArr[0];
            if(!weekPrChain){
                weekPrChain = null;
            }
            res.status(201).json(weekPrChain);
        } catch (err) {
            console.log(err);
            req.flash("error", "There was a problem!")
            res.redirect("/home")
        }
    }, 
}
