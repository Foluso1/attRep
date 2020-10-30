const Worker        =   require("../models/worker")
    , PrayerChain   =   require("../models/prayerChain")
    , newPrayerChain   =   require("../models/newPrayerChain")
    , moment        =   require("moment")
    ;


module.exports = {
    postPrayerReport: async (req, res) => {
        try {
            // req.body should have day number, and start / end time
            //Does prayer chain for that week exist?
            let thisWeekNumber = moment().locale("en-us").week();

            let foundPrayerChainArr = await newPrayerChain.find({
                prayor: req.user.id,
                week: thisWeekNumber,
                date: { $gte: moment().startOf("year").format() }
            })
            if (!(foundPrayerChainArr && foundPrayerChainArr.length > 0)) {
                foundPrayerChain = await newPrayerChain.create({
                    // Set week number; set prayor
                    week: thisWeekNumber,
                    prayor: req.user.id,
                })
            } else {
                foundPrayerChain = foundPrayerChainArr[0];
            }
            // What type is being sent (start or end?)
            let day = moment().day();
            // Set start / end time
            if (!foundPrayerChain[day].start) {
                foundPrayerChain[day]['start'] = new Date();
                // If start, set prayed to true
            } else if (!foundPrayerChain[day]['end']) {
                foundPrayerChain[day]['end'] = new Date();
                foundPrayerChain[day].prayed = true;
                foundPrayerChain[day].duration = moment(foundPrayerChain[day].end).valueOf() - moment(foundPrayerChain[day].start).valueOf();
                // Update frequency (add +1)
                if(foundPrayerChain[day].duration >= (59 * 60 * 1000)) {
                    foundPrayerChain.frequency++;
                }
            } else if (foundPrayerChain[day].start && foundPrayerChain[day].end){
                req.flash("error", "You have reported your prayer chain today");
                return res.redirect("/prayerchain")
            }
            await foundPrayerChain.save()
            res.status(201).json(foundPrayerChain);
        } catch (err) {
            console.log(err);
            req.flash("error", "There was a problem");
            res.redirect("/home");
        }
    },

    getPrayerReports: async (req, res) => {
        try {
            let foundPrayerChainArr = await newPrayerChain.find({
                prayor: req.user.id,
                week: moment().locale("en-us").week(),
            });
            let weekPrChain = foundPrayerChainArr[0];
            if(!weekPrChain){
                weekPrChain = await newPrayerChain.create({
                    prayor: req.user.id,
                    week: moment().locale("en-us").week(),
                })
            }
            res.render("prayerChain/prayerChain", {weekPrChain});
        } catch (err) {
            console.log(err);
            req.flash("error", "There was a problem!")
            res.redirect("/home")
        }
    },

    newPrayerReport: async (req, res) => {
        try {
            let starttime = {};
            let foundPrayerChainArr = await newPrayerChain.find({
                prayor: req.user.id,
                week: moment().locale("en-us").week(),
            });

            let shouldSendReport = {};
            shouldSendReport['0'] = true;
            shouldSendReport['1'] = true;

            if (foundPrayerChainArr && foundPrayerChainArr.length > 0){
                foundPrayerChain = foundPrayerChainArr[0];
                let day = moment().day();
                starttime = foundPrayerChain[day].start;
                if(starttime){
                    shouldSendReport['0'] = false;
                    if(foundPrayerChain[day].end){
                        // Both start and end reports sent already;
                        shouldSendReport['1'] = false;
                    }
                }
            }
            res.render("prayerChain/prayerChainNew", {shouldSendReport, starttime});
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
