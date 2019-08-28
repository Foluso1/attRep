const   Worker  =   require("../models/worker"),
        db      =   require("../models")
                ;

module.exports = {
    getWorker: (req, res) => {
        db.Worker.find({})
            .then((workers) => {
                res.json(workers);
            })
            .catch((err) => {
                console.log(err);
            })},

    createWorker: (req, res) => {
        let newWorker = { name: req.body.name }
        console.log(newWorker);
        db.Worker.create(newWorker)
            .then((worker) => {
                res.json({message: "Worker created successfully!"});
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

