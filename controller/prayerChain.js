const Worker        =   require("../models/worker")
    , PrayerChain   =   require("../models/prayerChain")
    // , newPrayerChain   =   require("../models/newPrayerChain")
    , moment        =   require("moment")
    ;


module.exports = {
    postPrayerReport: async (req, res) => {
        try {
            
            let req = {
                user: {
                    id: "5f4630df8172fd1f741a92f4"
                }
            }

            let foundPrayerChain = await PrayerChain.findOne({
                prayor: req.user.id,
                start: { $gte: moment().startOf("day").format() },
            });
            console.log("///foundPrayerChain", foundPrayerChain);
            if (foundPrayerChain && foundPrayerChain.end == null) {
                foundPrayerChain.end = Date.now();
                await foundPrayerChain.save();
            } else if (!foundPrayerChain) {
                let newPrayerChain = PrayerChain.create({
                    prayor: req.user.id,
                    start: Date.now(),
                })            
            } else {
                req.flash("error", "You have reported your prayer chain today");
                return res.redirect("/prayerchain")
            }
            res.status(201).json(foundPrayerChain);
        } catch (err) {
            console.log(err);
            req.flash("error", "There was a problem");
            res.redirect("/prayerchain");
        }
    },

    getPrayerReports: async (req, res) => {
        try {
            let foundPrayerChainArr = await PrayerChain.find({
                prayor: req.user.id,
                start: { $gte: moment().startOf("week").format() },
            });
            console.log(foundPrayerChainArr);
            res.json(foundPrayerChainArr);
            // res.render("prayerChain/prayerChain", {weekPrChain});
        } catch (err) {
            console.log(err);
            req.flash("error", "There was a problem!")
            res.redirect("/home")
        }
    },

    newPrayerReport: async (req, res) => {
        try {
            // let starttime = {};
            console.log(req.user.id);
            let foundPrayerChain = await PrayerChain.findOne({
                prayor: req.user.id,
                start: { $gte: moment().startOf("day").format() }
            });

            // let shouldSendReport = {};
            // if(foundPrayerChain){
            //     shouldSendReport['1'] = false;
            // }
            // let shouldSendReport = {};
            // shouldSendReport['0'] = true;
            // shouldSendReport['1'] = true;

            // if (foundPrayerChainArr && foundPrayerChainArr.length > 0){
            //     foundPrayerChain = foundPrayerChainArr[0];
            //     let day = moment().day();
            //     starttime = foundPrayerChain[day].start;
            //     if(starttime){
            //         shouldSendReport['0'] = false;
            //         if(foundPrayerChain[day].end){
            //             // Both start and end reports sent already;
            //             shouldSendReport['1'] = false;
            //         }
            //     }
            // }
            // res.json(foundPrayerChain);
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
