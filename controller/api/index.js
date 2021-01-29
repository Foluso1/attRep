const           newPrayerChain  = require("../../models/newPrayerChain");
const           Worker          = require("../../models/worker");
const           Disciple          = require("../../models/disciple");
const           Expected        = require("../../models/expected_attendance_model");
const           Evangelism      = require("../../models/evangelism");
const           BelConv         = require("../../models/believers_convention_model");
const           Attendance      = require("../../models/attendance_model");
const           moment          = require("moment");
const           fs              = require("fs");
const discipleship_model = require("../../models/discipleship_model");
const { workers } = require("cluster");
const reportToPastor = require("../../models/reportToPastor");


module.exports = {
    workersDetails: async (req, res) => {
        try {
            let allWorkers = await Worker.find().select("firstname surname church fellowship department prayerGroup email address dateOfBirth employementStatus gender maritalStatus membershipClass mobileNumber");
        ;
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
            let data = JSON.stringify(thisWorkers);
            console.log(data)
            fs.writeFileSync("workers_details2.json", data);
        } catch (e) {
            console.log(e);
        }
    },

    getCumulativeAttendance: async (req, res) => {
        try {

            // let bcfiles = await BelConv.deleteMany();
            // console.log(bcfiles);

            // let countDisc = 0
            // let allDisciples = await Disciple.find();
            // for (let i = 0; i < allDisciples.length; i++){
            //     let newBelConv = new BelConv({
            //         year: moment().year().toString(),
            //         attendee: allDisciples[i]._id,
            //     })
            //     await newBelConv.save();
            //     allDisciples[i].belConv = [];
            //     allDisciples[i].belConv.push(newBelConv._id);
            //     countDisc++;
            // }
            // console.log("countDisc", countDisc);

            // let countWorkers = 0;
            // let allWorkers = await Worker.find();
            // for (let i = 0; i < allWorkers.length; i++){
            //     let newBelConv = new BelConv({
            //         year: moment().year().toString(),
            //         attendee: allWorkers[i]._id,
            //     })
            //     await newBelConv.save();
            //     allWorkers[i].belConv = [];
            //     allWorkers[i].belConv.push(newBelConv._id);
            //         countWorkers++;
            // }
            // console.log("countWorkers", countWorkers);
/////

            // let foundRes = await Attendance.find({
            //     for: new RegExp(req.params.meetingName, "i"),
            //     // summoner: req.user.id
            // })

            // for(let j=0; j<foundRes.length; j++) {
            //     let item = foundRes[j];

            //     //function
            //     const fixBelConvAttendance = async (item, day, timeOfDay) => {
            //         console.log("item.for", item.for)
            //         try {
            //             for(let i = 0; i< item.disciples.length; i++){
            //                 let bcAtt = {};
            //                 let findBc = await BelConv.findOne({
            //                     attendee: item.disciples[i],
            //                     year: moment().year().toString(),
            //                 });
            //                 console.log("findBc", findBc)

            //                 if(!findBc){
            //                     let foundElement = await Disciple.findById(item.disciples[i]);
            //                     findBc = await new BelConv({
            //                         attendee: foundElement._id,
            //                         attendance: true,
            //                         year: moment().year().toString(),
            //                     })
            //                     findBc[day][timeOfDay] = true,
            //                     await findBc.save();       
            //                 } else {
            //                     console.log("found");
            //                     findBc[day][timeOfDay] = true;
            //                     findBc.attendance = true;
            //                     await findBc.save();
            //                 }
            //             }
            //         } catch (e) {
            //             console.log(e)
            //         }
            //     }
            // // }
            // //     ///end function

            //     if(item.for == "Believer's Convention Friday evening"){
            //         console.log("Believer's Convention Friday evening")
            //         fixBelConvAttendance(item, 5, 2);
            //     } else if(item.for == "Believer's Convention Saturday morning"){
            //         console.log("Believer's Convention Saturday morning")
            //         fixBelConvAttendance(item, 6, 0);
            //     } else if(item.for == "Believer's Convention Saturday afternoon"){
            //         console.log("Believer's Convention Saturday afternoon")
            //         fixBelConvAttendance(item, 6, 1);
            //     } else if (item.for == "Believer's Convention Sunday morning"){
            //         console.log("Believer's Convention Sunday morning")
            //         fixBelConvAttendance(item, 0, 0);
            //     } else if (item.for == "Believer's Convention Sunday afternoon"){
            //         console.log("Believer's Convention Sunday afternoon")
            //         fixBelConvAttendance(item, 0, 1);
            //     }
            // };

            


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
            
            res.json(flpEvglsm);

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

    goFix: async (req, res) => {
        try {
            // let foundEvglsmReport = await Evangelism.find().populate({path: "author", select: "firstname surname"}).sort({date: -1}).limit(1);
            // res.json(foundEvglsmReport);
        } catch (e) {
            console.log(e);
        }
    }
};