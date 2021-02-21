const           PrayerChain     = require("../../models/prayerChain");
const           Worker          = require("../../models/worker");
const           Disciple        = require("../../models/disciple");
const           Expected        = require("../../models/expected_attendance_model");
const           Evangelism      = require("../../models/evangelism");
const           BelConv         = require("../../models/believers_convention_model");
const           Attendance      = require("../../models/attendance_model");
const           moment          = require("moment");
const           fs              = require("fs");
const           Church          = require("../../models/church");
const           reportToPastor  = require("../../models/reportToPastor");
// const { create } = require("../../models/disciple");


module.exports = {
    workersDetails: async (req, res) => {
        try {
            let workersUnder = await Worker.findById({ _id: req.user.id });
            workersUnder = workersUnder.workers;
            workersUnder = workersUnder.map((item) => {
                return item._id;
            })
            let allWorkers = await Worker.find({
                _id: {$in: workersUnder}
            }).select("firstname surname church fellowship department prayerGroup email address dateOfBirth employementStatus gender maritalStatus membershipClass mobileNumber");
        ;
        res.json(allWorkers);
        } catch (e) {
            console.log(e)
        }
    },

    getPrayerChainReportsforOne: async (req, res) => {
        try {
            let weekPrChain = await PrayerChain.find({
                prayor: req.params.id,
                start: {
                    $gte: req.params.start,
                    $lte: moment(req.params.end).add(1, "day")
                },
            });
            weekPrChain = weekPrChain.sort((a,b)=>{
                let aDate = new Date(b.start).getTime();
                let bDate = new Date(a.start).getTime();
                console.log(bDate - aDate);
                return aDate - bDate;
            })
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
                obj.week = moment().locale("en-gb").week();
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
                    name: `${item.author.firstname} ${item.author.surname}`,
                    name: item.firstname,
                    gender: item.gender,
                    phone:  item.mobileNumber,
                    address:  item.address,
                    email:  item.email,
                    church:  item.church,
                    fellowship:  item.fellowship,
                }
            })
            let data = JSON.stringify(thisWorkers);
            console.log(data)
            fs.writeFileSync("workers_details2.json", data);
        } catch (e) {
            console.log(e);
        }
    },

    getCumulativeAttendance: async (req, res) => {
        try {
            


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

    getAllAttendanceWithDate: async (req, res) => {
        try {
            let flpWrkrs = await Worker.find({
                overseer: req.user.id,
                fellowship: req.params.fellowship
            });

            let idsflpWrkrs = flpWrkrs.map((item) => {
                return item._id;
            });

            let flpAtt = await Attendance.find({
                for: req.params.for,
                summoner: {$in: idsflpWrkrs},
                date: {$gte: req.params.date, $lt: moment(req.params.date).add(24, "hour")},
            }).populate({path: "disciples", select: "name type"}).populate({path: "summoner", select: "firstname surname fellowship"});

            let idsAtt = flpAtt.map((item) =>{
                return item._id;
            });

            let noReport = await Worker.find({
                attendance: {$nin: idsAtt},
                overseer: req.user.id,
                fellowship: req.params.fellowship
            }).select("firstname surname");

            let obj = {
                present: flpAtt,
                absent: noReport
            };
           
            res.json(obj);
        } catch(e) {
            console.log(e)
            req.flash("error", "There was a problem");
            res.redirect("/")
        }
    },

    getAllExpectedAttendanceWithDate: async (req, res) => {
        try {
            let flpWrkrs = await Worker.find({
                overseer: req.user.id,
                fellowship: req.params.fellowship
            });

            let idsflpWrkrs = flpWrkrs.map((item) => {
                return item._id;
            });

            let flpExp = await Expected.find({
                for: req.params.for,
                summoner: {$in: idsflpWrkrs},
                date: {$gte: req.params.date, $lt: moment(req.params.date).add(24, "hour")},
            }).populate({path: "disciples", select: "name type"}).populate({path: "summoner", select: "firstname surname fellowship"});

            let idsAtt = flpExp.map((item) =>{
                return item._id;
            });

            let noReport = await Worker.find({
                expected_attendance: {$nin: idsAtt},
                overseer: req.user.id,
                fellowship: req.params.fellowship
            }).select("firstname surname");

            let obj = {
                present: flpExp,
                absent: noReport
            };

            console.log(obj)
           
            res.json(obj);
            
        } catch(e) {
            console.log(e)
            req.flash("error", "There was a problem");
            res.redirect("/")
        }
    },

    getAllEvangelismWithDate: async (req, res) => {
        try {
            let obj = {};

            let flpWrkrs = await Worker.find({
                overseer: req.user.id,
                fellowship: req.params.fellowship
            });

            let idsflpWrkrs = flpWrkrs.map((item) => {
                return item._id;
            });

            let flpEvglsm = await Evangelism.find({
                author: {$in: idsflpWrkrs},
                date: {$gte: req.params.start, $lt: moment(req.params.end).add(24, "hour")}
            }).populate({path: "author", select: "firstname surname"});

            console.log(flpEvglsm);

            flpEvglsm.forEach((item)=>{
                if(obj[`${item.author.firstname} ${item.author.surname} ${item.author._id}`]){
                    obj[`${item.author.firstname} ${item.author.surname} ${item.author._id}`].push(item);
                } else {
                    obj[`${item.author.firstname} ${item.author.surname} ${item.author._id}`] = [];
                    obj[`${item.author.firstname} ${item.author.surname} ${item.author._id}`].push(item);
                }
            })
            console.log(obj);
            
            res.json(obj);

        } catch (e) {
            console.log(e)
            res.redirect("/")
        }
    },

    getOneEvangelismWithDate: async (req, res) => {
        try {
            const evglsmReports = await Evangelism.find({
                author: req.user.id,
                date: {$gte: req.params.start, $lt: moment(req.params.end).add(24, "hour")}
            }).populate({path: "author", select: "firstname surname"});
            res.json(evglsmReports);
        } catch (e) {
            console.log(e)
        }
    }, 

    addOrRemoveLMA: async (req, res) => {
        try {
            let reportId = req.params.reportId;
            let lmaId = req.params.lmaId;
            let thisReport = await reportToPastor.findById({ _id: reportId });
            if(thisReport.attendees.lma.includes(lmaId)){
                console.log("includes");
                let index = thisReport.attendees.lma.indexOf(lmaId);
                console.log(index);
                thisReport.attendees.lma.splice(index, 1);
            } else {
                console.log("doesn't include");
                thisReport.attendees.lma.push(lmaId);
            }
            thisReport.save();
            res.json(thisReport);
        } catch (e) {
            console.log(e)
        }
    }, 

    getAllEvnglsmReports: async (req, res) => {
        try {
            console.log(req.params.fellowship)
            console.log(req.params.start)
            console.log(req.params.end)

            let flpWrkrs = await Worker.find({
                overseer: req.user.id,
                fellowship: req.params.fellowship
            });

            let idsflpWrkrs = flpWrkrs.map((item) => {
                return item._id;
            });

            let evglsmReports = await Evangelism.find({
                author: {$in: idsflpWrkrs},
                date: {$gte: req.params.start, $lt: moment(req.params.end).add(24, "hour")}
            }).populate({path: "author", select: "firstname surname fellowship"});

            if (req.params.fellowship == 'New Garage'){
                fozEvglsmReports = await Evangelism.find({
                    author: req.user.id,
                    date: {$gte: req.params.start, $lt: moment(req.params.end).add(24, "hour")}
                }).populate({path: "author", select: "firstname surname"});
                evglsmReports = [...evglsmReports, ...fozEvglsmReports];
            }

            let allSouls = [];
            evglsmReports.forEach((item)=>{
                let thisDetails = JSON.parse(item.data);
                let obj = {};
                if(typeof(thisDetails.details) == "object" && thisDetails.details.firstname && Array.isArray(thisDetails.details.firstname)){
                    let length = thisDetails.details.firstname.length;
                    for(let i=0; i<length; i++){
                        obj = {
                            name: `${thisDetails.details.firstname[i]} ${thisDetails.details.lastname[i]}`,
                            gender: thisDetails.details.gender[i],
                            address: thisDetails.details.address[i],
                            mobile: thisDetails.details.mobile[i],
                            english: thisDetails.details.language && thisDetails.details.language[i]  == "English" ? "Yes" : 'No',
                            language: thisDetails.details.language ? thisDetails.details.language[i] : 'Nil',
                            status: thisDetails.details.status[i],
                            worker: `${item.author.firstname} ${item.author.surname}`,
                        }
                        console.log(obj);
                        allSouls.push(obj);
                    }
                } else {
                    obj = {
                        name: `${thisDetails.details.firstname} ${thisDetails.details.lastname}`,
                        gender: thisDetails.details.gender,
                        address: thisDetails.details.address,
                        mobile: thisDetails.details.mobile,
                        english: thisDetails.details.language  == "English" ? "Yes" : 'No',
                        language: thisDetails.details.language,
                        status: thisDetails.details.status,
                        worker: `${item.author.firstname} ${item.author.surname}`,
                    }
                    allSouls.push(obj);
                }
            })
            
            // console.log("///", evglsmReports);
            let data = JSON.stringify(allSouls);
            fs.writeFileSync(`souls_won_${req.params.fellowship.trim()}_${req.params.start}_${req.params.end}.json`, data);
            res.json(allSouls);
        } catch (e) {
            console.log(e)
        }
    },

    getOneEvnglsmReports: async (req, res) => {
        try {

            let evglsmReports = await Evangelism.find({
                author: req.params.id,
                date: {$gte: req.params.start, $lt: moment(req.params.end).add(24, "hour")}
            }).populate({path: "author", select: "firstname surname fellowship"});
            
            console.log("///", evglsmReports);
            // let data = JSON.stringify(allSouls);
            // fs.writeFileSync(`souls_won_${req.params.fellowship.trim()}_${req.params.start}_${req.params.end}.json`, data);
            res.json(evglsmReports);
        } catch (e) {
            console.log(e)
        }
    },

    goFix: async (req, res) => {
        try {
            let newGarage = {
                name: "New Garage",
                type: "fellowship"
            }
            let obj1 = {
                name: "New Garage 1",
                type: "cell",
            }
            let obj2 = {
                name: "New Garage 2",
                type: "cell",
            }
            newGarage = await Church.create(newGarage);
            let newChurch1 = await Church.create(obj1);
            let id1 = newChurch1._id;
            let newChurch2 = await Church.create(obj2);
            let id2 = newChurch2._id;
            console.log(newGarage);
            console.log("ids", id1, id2)

            newGarage.churchUnder.push(id1);
            newGarage.churchUnder.push(id2);
            res.json({newGarage, newChurch1, newChurch2});
        } catch (e) {
            console.log(e);
        }
    }
};

const allCellsUnder = (churchId) => {
    let ids = []
    let church = Church.findById({ _id: churchId });
    let churchUnder = church.churchUnder;
    if(churchUnder && Array.isArray(churchUnder) && churchUnder.length != 0){
        churchUnder.forEach((item) => {
            allCellsUnder(item._id);
        })
    } else if (Array.isArray(churchUnder) && churchUnder.length == 0){
        ids = [ids, ...churchUnder]
    }
    return(ids);
}
