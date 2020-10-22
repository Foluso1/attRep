const       Worker      = require("../models/worker");
const       moment      = require("moment");

module.exports = async (dateForData, foundWorker, path) => {
        try {
            let workersUnder = foundWorker.workers;
            let startOfToday = 0;
            if (!dateForData) {
                startOfToday = moment().startOf('day').valueOf();
            } else {
                startOfToday = moment(dateForData).startOf("day").valueOf();
            }
            let manyArr = [];
            let noReportYet = [];
            let disciples = [];
            let noReportNames = "";
            let reportList = "";
            let totalAttendees = 0;

            // 

            for(let i = 0; i < workersUnder.length; i++) {
                if(workersUnder.length > 0 && workersUnder[i][path].length > 0){
                    let isReportToday = false;
                    let thisWorker = await Worker.findById({ _id: workersUnder[i].id }).populate( {path: path, populate: { path: "disciples"}});
                    if (thisWorker[path].length > 0) {
                        let expectedArr = thisWorker[path];
                        expectedArr.filter( (item) => {
                            let thisDay = moment(item.date).startOf("day").valueOf();
                            if (startOfToday == thisDay) {
                                isReportToday = true;
                                let abc = { 
                                    date: item.date,
                                    id: thisWorker.id,
                                    firstname: thisWorker.firstname,
                                    surname: thisWorker.surname,
                                    title: item.title, 
                                    for: item.for, 
                                    info: item.info, 
                                    fellowship: thisWorker.fellowship,
                                    disciples: disciples = item.disciples.map((each) => {
                                        return each.name;
                                    }),
                                    totalAttendees: totalAttendees = (totalAttendees + item.disciples.length),
                                }
                                manyArr.push(abc)
                            } 
                        });
                        if(!isReportToday) {
                            let abc = {
                                id: thisWorker.id,
                                firstname: thisWorker.firstname,
                                surname: thisWorker.surname,
                                fellowship: thisWorker.fellowship,
                            }
                            noReportYet.push(abc);
                        }
                    } else {
                        let abc = {
                            id: thisWorker.id,
                            firstname: thisWorker.firstname,
                            surname: thisWorker.surname,
                            fellowship: thisWorker.fellowship,
                        }
                        noReportYet.push(abc);
                    }
                } else if (workersUnder[i]) {
                    let thisWorker = await Worker.findById({ _id: workersUnder[i].id });
                    let abc = {
                        id: thisWorker.id,
                        firstname: thisWorker.firstname,
                        surname: thisWorker.surname,
                        fellowship: thisWorker.fellowship,
                    }
                    noReportYet.push(abc);
                }
            }

            // SORTING ALGORITHM
            // According to time of reporting
            manyArr.sort((a, b) => {
                return b.date.getTime() - a.date.getTime();
            });

            // Sort by fellowship 
            manyArr.forEach((elem) => {
                if(elem.fellowship == "New Garage"){
                    elem.fellowship = 0;
                } else if (elem.fellowship == "Yabatech") {
                    elem.fellowship = 1;
                } else {
                    elem.fellowship = 2;
                }
            })
            noReportYet.forEach((elem) => {
                if(elem.fellowship == "New Garage"){
                    elem.fellowship = 0;
                } else if (elem.fellowship == "Yabatech") {
                    elem.fellowship = 1;
                } else {
                    elem.fellowship = 2;
                }
            })
            manyArr.sort((a,b) => {
                return a.fellowship - b.fellowship;
            });
            noReportYet.sort((a,b) => {
                return a.fellowship - b.fellowship;
            });
            manyArr.forEach((abc) => {
                if (abc.info) {
                    reportList = reportList + `${abc.firstname} ${abc.surname} \n\t ${abc.disciples.join("\n\t")} \n\t${abc.info.split("\n").join("\n\t")}\n`;
                } else {
                    reportList = reportList + `${abc.firstname} ${abc.surname} \n\t ${abc.disciples.join("\n\t")}\n`;
                }
            })
            noReportYet.forEach((abc) => {
                noReportNames = noReportNames + `${abc.firstname} ${abc.surname} \n`;
            })
            return { manyArr, startOfToday, noReportNames, totalAttendees, noReportYet, reportList }
        } catch (e) {
            console.log(e);
        }
    }