const           newPrayerChain  = require("../../models/newPrayerChain");
const           Worker          = require("../../models/worker")

module.exports = {
    workersDetails: async (req, res) => {
        try {
            let allWorkers = await Worker.find();
            allWorkers.forEach((elem) => {
                elem.password = undefined;
                elem.resetPasswordToken = undefined;
                elem.resetPasswordExpires = undefined;
                elem.googleIdentity = undefined;
                elem.googleName = undefined;
                elem.googleMail = undefined;
                elem.isLMA = undefined;
                elem.isAdmin	= undefined;
                elem.linkCount = undefined;
                elem.discAssoc = undefined;
                elem._id = undefined;
                elem.__v = undefined;
                elem.data = undefined;
                elem.username = undefined;
            })
            res.json(allWorkers);
        } catch (e) {
            console.log(e)
        }
    },

    getPrayerChainReportsforOne: async (req, res) => {
        try {
            let foundPrayerChainArr = await newPrayerChain.find({
                prayor: req.params.id,
                week: req.params.weekNum,
            });
            res.status(201).json(weekPrChain);
        } catch (e) {
            console.log(e);
            res.status(500);
        }
    },

    getAllPrayerChain: async (req, res) => {
        try {
            let foundPrayerChainArr = await newPrayerChain.find({
                week: req.params.weekNum,
            }).populate({path: "prayor", select: "firstname surname"}); 
            console.log(foundPrayerChainArr);
            res.status(201).json(foundPrayerChainArr);
        } catch (e) {
            console.log(e);
            res.status(500);
        }
    }
};