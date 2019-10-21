const       Workers     =       require("../models/worker")


module.exports = {
    getWorkers: (req, res) => {
        let currentWorker = req.user.id;
        Workers.findById(currentWorker).populate("workers")
        .then((foundWorker) => {
            let subWorkers = foundWorker.workers
            subWorkers.forEach((foundworker) => {
                foundworker.password = undefined;
                // console.log(foundworker.username);
            })
            // console.log(subWorkers)
            res.render("lma", { subWorkers });
            // console.log(foundWorkers);
        })
        .catch((err) => {
            console.log(err);
        })
    },

    postWorker: (req, res) => {
        let currentWorker = req.user.id;
        console.log("From Post Route");
        console.log(req.body);
        let input = { _id: req.body._id };
        // console.log(input);
        Workers.findById(input)
        .then((foundWorker) => {
            Workers.findById(currentWorker)
            .then((lma) => {
                lma.workers.push(foundWorker);
                lma.save();
                console.log("Saved!!");
                res.status(201).end();
            })
            .catch((err) => {
                console.log(err);
            })
            // console.log(foundWorker)
            // console.log(foundWorkers);
        })
        // res.send("Well done!");
    },

    newWorker: (req, res) => {
        let currentWorker = req.user.id;
        let arrWorkers = [];
        let addWorker = [];
        Workers.findById({ _id: currentWorker })
            .populate("workers")
            .then((lma) => {
                Workers.find()
                    .populate("workers")
                    .then((workerList) => {
                        let workerCheck = lma.workers;
                        workerList.forEach((worker) => {
                                arrWorkers.push(worker);
                        })
                        let arrWorkersId = arrWorkers.map((foundOne) => {
                            return foundOne._id.toString();
                        });
                        let arrWorkersIdTwo = arrWorkers.map((foundOne) => {
                            return foundOne._id.toString();
                        }); //5-3-1; 5-3-1-1; 5-3-1-2; 5-3-1-3
                        if (workerCheck.length != 0) {
                            for(let i = 0; i < arrWorkers.length; i++) {
                                let j = Math.abs(workerCheck.length - 1 - i); 
                                if(j >= workerCheck.length){
                                    j = 0;
                                }
                                let worker = workerCheck[j];
                                console.log("j is " + j);
                                console.log("worker.length");
                                console.log(worker.length);
                                // if (worker.length >= 0) {
                                    console.log(worker);
                                    let index = arrWorkersId.indexOf(worker._id.toString());
                                    console.log("Index is " + index);
                                    if (index != -1) {
                                        arrWorkersId.splice(index, 1);
                                    // }
                                }
                            }
                        }
                        arrWorkersId.splice(arrWorkersId.indexOf(currentWorker.toString()), 1); //remove currentworker from array
                        console.log(arrWorkersId);
                        arrWorkersId.forEach((workerId) => {
                            addWorker.push(arrWorkers[arrWorkersIdTwo.indexOf(workerId)]);
                        })
                        console.log("addWorker tailend is ");
                        console.log(addWorker);
                        res.render("lmaNew", { addWorker, workerCheck });
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            })
            .catch((err) => {
                console.log(err);
            })
    },

    editWorker: (req, res) => {
        console.log("the put route");
        console.log(req.body);
        let currentWorker = req.user.id;
        Workers.findById(currentWorker)
            .then((foundWorker) => {
                let arr = foundWorker.workers;
                console.log("Arr length is " + arr.length);
                // console.log(arr);
                let index = arr.indexOf(req.body._id);
                console.log(index);
                if (index == -1){
                    console.log("not saved!");
                    res.json("not removed")
                } else {
                    arr.splice(index, 1);
                    foundWorker.save();
                    console.log("Arr length is " + arr.length);
                    console.log("success");
                    res.json("removed");
                }
            })
            .catch((err) => {
                console.log(err);
            })
    },

    removeWorker: (req, res) => {
        let currentWorker = req.body;
        Workers.findById(currentWorker)
        .then((foundWorker) => {
            foundWorker.workers
        })
        .catch((err) => {
            console.log(err);
        })
    }
}
 