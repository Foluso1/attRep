const Worker        =   require("../models/worker")
    , PrayerChain   =   require("../models/prayerChain")
    , moment        =   require("moment")
    ;


module.exports = {
    postPrayerReport: async (req, res) => {
        try {
            let currentWorker = req.user.id;
            let newPrayerChain = await PrayerChain.create({start: req.body.starttime});
            let foundWorker = await Worker.findById({ _id: currentWorker });

            foundWorker.prayerChainReport.push(newPrayerChain);
            foundWorker.save();

            res.json(newPrayerChain);
        } catch (err) {
            console.log(err);
        }
    },

    getPrayerReports: async (req, res) => {
        try {
            currentWorker = req.user.id;
            let thisWeekNum = moment().week()-1;
            let allDayPrayed = [];
            let foundWorker = await Worker.findById({ _id: currentWorker }).populate({
                path: "prayerChainReport"
            });
            let prChRepAll = foundWorker.prayerChainReport;
            prChRepAll.forEach((oneItem) => {
                if(thisWeekNum == moment(oneItem.date).week()) {
                    let dayPrayed = moment(oneItem.date).format("dddd");
                    let startTime = moment(oneItem.start).format("h:mm a");
                    let endTime = moment(oneItem.end).format("h:mm a");
                    let dayData = [dayPrayed, startTime, endTime];
                    allDayPrayed.push(dayData)
                }
            })
            res.render("prayerChain/prayerChain", { thisWeekNum, allDayPrayed });
        } catch (err) {
            console.log(err);
        }
    },

    newPrayerReport: async (req, res) => {
        try {
            let currentWorker = req.user.id;
            let foundWorker = await Worker.findById({ _id: currentWorker }).populate({
                path: "prayerChainReport",
                options: { sort: { date: -1 }, limit: 1 } 
            });
            let lastPrChReport = foundWorker.prayerChainReport;
            let lastPrChReportId;
            let endPrChReport;
            let lastPrChReportDate; 
            if (lastPrChReport.length != 0) {
                lastPrChReportDate = foundWorker.prayerChainReport[0].date.getTime();
                lastPrChReportId = foundWorker.prayerChainReport[0]._id;
                endPrChReport = foundWorker.prayerChainReport[0].end
                if (endPrChReport == undefined) {
                    endPrChReport;
                } else {
                    endPrChReport = endPrChReport.getTime();
                }
            }
            let startOfDay = moment().startOf('day')._d.getTime();
            let prChRange = moment().hour(15).minute(10).second(0).millisecond(0)._d.getTime();

            res.render("prayerChain/prayerChainNew", { lastPrChReportDate, startOfDay, prChRange, lastPrChReportId, endPrChReport });
        } catch (err) {
            console.log(err);
        }
        
    }, 

    updatePrayerReport: async (req, res) => {
        try {
            let id = req.params.id;
            let endtime = {
                end: req.body.end
            }
            let updatedPrCh = await PrayerChain.findOneAndUpdate({ _id: id}, endtime, {new: true} );
            await updatedPrCh.save();
            res.json(updatedPrCh);
        } catch (err) {
            console.log(err);
        }
    }

}
