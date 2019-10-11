const       Workers     =       require("../models/worker")


module.exports = {
    getWorkers: (req, res) => {
        let currentWorker = req.user.id;
        Workers.findById(currentWorker).populate("workers")
        .then((foundWorker) => {
            let subWorkers = foundWorker.workers
            subWorkers.forEach((foundworker) => {
                foundworker.password = undefined;
                console.log(foundworker.username);
            })
            console.log(subWorkers)
            res.render("lma", { subWorkers });
            // console.log(foundWorkers);
        })
        .catch((err) => {
            console.log(err);
        })
    },

    postWorker: (req, res) => {
        let currentWorker = req.user.id;
        console.log(req.body);
        let input = { _id: req.body.id };
        console.log(input);
        Workers.findById(input)
        .then((foundWorker) => {
            Workers.findById(currentWorker)
            .then((lma) => {
                lma.workers.push(foundWorker);
                lma.save();
                console.log("Saved!!");
            })
            .catch((err) => {
                console.log(err);
            })
            console.log(foundWorker)
            // console.log(foundWorkers);
        })
        res.send("Well done!");
    },

    newWorker: (req, res) => {
        let currentWorker = req.user.id;
        let arrWorkers = [];
        Workers.find().populate("workers")
            .then((foundWorkers) => {
                foundWorkers.forEach((foundworker) => {
                    foundworker.password = undefined;
                    // foundWorker.populate("workers")
                    console.log(foundworker._id);
                    if (foundworker._id == currentWorker) {
                        console.log("I skipped it!");
                    } else {
                        arrWorkers.push(foundworker);
                    }
                    // console.log(arrWorkers);
                })
                // console.log(foundWorkers)
                res.render("lmaNew", { arrWorkers });
                // console.log(foundWorkers);
            })
            .catch((err) => {
                console.log(err);
            })
        // res.render("lmaNew");
    }
}
 