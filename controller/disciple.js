const           Worker      =   require("../models/worker")
            ,   Disciple      =   require("../models/disciple")
            ;


module.exports = {
    getDisciples: (req, res) => {
        console.log("Disciple page");
        // let worker = {
        //     _id: req.user.id
        // }
        // Worker.Reports.find()//.populate("disciples").exec()
        //     .then((thisDisc) => {
        //         let reports = thisDisc.report;
        //         // console.log(worker)
        //         // console.log("////////////////")
        //         console.log(thisDisc);
        res.render("disciple");
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
    },

    postDisciple: (req, res) => {
        let idWorker = {
            _id: req.user.id
        }
        let data = {
            name: req.body.name
        }
        Disciple.create(data)
        .then((disciple) => {
            return disciple; 
        })
        .then((disciple) => {
        Worker.findById(idWorker)
            .then((worker) => {
                worker.disciples.push(disciple)
                worker.save();
                res.redirect("/report/new");
            })
        })
    
        .catch((err) => {
            console.log(err);
        })
    },

    createNewDiscple: (req, res) => {
        res.render("new");
    }

}
