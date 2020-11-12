const           newPrayerChain  = require("../../models/newPrayerChain");
const           Worker          = require("../../models/worker");
const           Expected        = require("../../models/expected_attendance_model");
const           Attendance      = require("../../models/attendance_model");
const           moment          = require("moment");
const           fs              = require("fs");


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
            let weekPrChain = null;
            if (foundPrayerChainArr && foundPrayerChainArr.length > 0){
                weekPrChain = foundPrayerChainArr[0];
            }
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

            let foundWorker2 = await Worker.findById({ _id: req.user.id }).populate({path: "workers", select:"firstname surname"});
            let workersUnderWithInfo = foundWorker2.workers;

            const workersUnder = workersUnderWithInfo.map((item) => {
                return item._id;
            })

            foundPrayerChainArr.forEach(async (item) => {
                let index = workersUnder.indexOf(item.prayor._id);
                if(index){
                    workersUnder.splice(index, 1);
                    workersUnderWithInfo.splice(index, 1);
                }
            });

            const newPrChNoPrCh = workersUnderWithInfo.map((item) => {
                let obj = {};
                for(let i=0; i<7; i++){
                    obj[i] = {
                        start: null,
                        end: null,
                        duration: 0,
                        prayed: false
                    }
                }
                obj.week = moment().locale("en-us").week();
                obj.frequency = 0;
                obj.date = new Date();
                obj.prayor = item;
                return obj;
            })
            foundPrayerChainArr = [...foundPrayerChainArr, ...newPrChNoPrCh];
            res.status(201).json(foundPrayerChainArr);
        } catch (e) {
            console.log(e);
            res.status(500);
        }
    },

    getAllSpecialMeetingsExpected: async (req, res) => {
        try {
            let accomm = "";
            if (req.params.meetingName == "Believer's Convention") {
                accomm = "believersConventionAccommodation"
            } else {
                accomm = "charisCampmeeetingAccommodation"
            }
            let foundBC = await Expected.find({
                for: req.params.meetingName,
            })
            .populate({path: "disciples", select:`name gender mobileNumber address email ${accomm}`})
            .populate({path: "summoner", select:"firstname surname fellowship church"})
            let data = JSON.stringify(foundBC);
            fs.writeFileSync("disciples_details.json", data);
            res.json(foundBC);
        } catch (e) {
            console.log(e);
            res.status(500);
        }
    },

    belCovDetails: async (req, res) => {
        try {
            let foundWorkers = await Worker.find()
            .select("firstname surname gender mobileNumber address email church fellowship")
            let thisWorkers = foundWorkers.map((item) => {
                return obj = {
                    name: `${item.firstname} ${item.surname}`,
                    name: item.firstname,
                    gender: item.gender,
                    phone:  item.mobileNumber,
                    address:  item.address,
                    email:  item.email,
                    church:  item.church,
                    fellowship:  item.fellowship,
                }
            })
            // res.json(thisWorkers);
            let data = JSON.stringify(thisWorkers);
            console.log(data)
            // res.json(data);
            // res.json(foundWorkers);
            fs.writeFileSync("workers_details2.json", data);
        } catch (e) {
            console.log(e);
        }
    },

    getAllSpecialMeetingsAttendance: async (req, res) => {
        try {
            let foundBC = await Attendance.find({
                for: req.params.meetingName,
            })
            .populate({path: "disciples", select:"name gender mobileNumber address email believersConventionAccommodation"})
            .populate({path: "summoner", select:"firstname surname fellowship church"})
            let data = JSON.stringify(foundBC);
            fs.writeFileSync("disciples_details.json", data);
            res.json(foundBC);
        } catch (e) {
            console.log(e)
        }
    },
};